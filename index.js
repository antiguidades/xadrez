class Tabuleiro {
    constructor() {
        this.tabuleiro = [];
        for (let linha = 0; linha < 8; linha++) {
            this.tabuleiro[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                this.tabuleiro[linha][coluna] = new Casa(linha, coluna);
            }
        }
        this.selecionada = null;

        this.criarTabuleiroVisual();
    }

    criarTabuleiroVisual() {
        const tabuleiroHtml = document.getElementById('tabuleiro');
        tabuleiroHtml.innerHTML = '';
        for (let linha = 0; linha < 8; linha++) {
            for (let coluna = 0; coluna < 8; coluna++) {
                const casa = this.tabuleiro[linha][coluna];
                tabuleiroHtml.appendChild(casa.elementoHtml);

                casa.elementoHtml.addEventListener('click', () => {
                    this.clicarCasa(casa);
                });
            }
        }
    }

    colocarPeca(peca, linha, coluna) {
        const casa = this.tabuleiro[linha][coluna];
        casa.setPeca(peca);
    }

    clicarCasa(casa) {
        if (this.selecionada && this.selecionada.peca) {
            const peca = this.selecionada.peca;
            const movimentos = peca.movimentosPossiveis(this.tabuleiro);

            if (movimentos.some(mov => mov.linha === casa.linha && mov.coluna === casa.coluna)) {
                casa.setPeca(peca);
                this.selecionada.setPeca(null);
                peca.moverPara(casa.linha, casa.coluna);
                this.selecionada = null;
            } else {
                this.selecionada = null; 
            }
        } else if (casa.peca) {
            this.selecionada = casa; 
        }
    }
}

class Casa {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
        this.peca = null;

        this.elementoHtml = document.createElement('div');
        this.elementoHtml.classList.add('casa');
        if ((linha + coluna) % 2 === 0) {
            this.elementoHtml.classList.add('clara');
        } else {
            this.elementoHtml.classList.add('escura');
        }
    }

    setPeca(peca) {
        this.peca = peca;
        this.elementoHtml.innerHTML = peca ? peca.simbolo : '';
    }
}

class Peca {
    constructor(cor, linha, coluna) {
        this.cor = cor;
        this.linha = linha;
        this.coluna = coluna;
        this.simbolo = '';
    }

    movimentosPossiveis(tabuleiro) {
        return [];
    }

    moverPara(novaLinha, novaColuna) {
        this.linha = novaLinha;
        this.coluna = novaColuna;
    }
}

class Peao extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9817;' : '&#9823;';
        this.movimentoInicial = true; 
    }

    movimentosPossiveis(tabuleiro) {
        const movimentos = [];
        const direcao = this.cor === 'branca' ? -1 : 1; 
        const linhaFrente = this.linha + direcao;

        if (
            this.estaDentroDoTabuleiro(linhaFrente, this.coluna) &&
            !tabuleiro.tabuleiro[linhaFrente][this.coluna].peca
        ) {
            movimentos.push({ linha: linhaFrente, coluna: this.coluna });

            const linhaDuasFrentes = this.linha + 2 * direcao;
            if (
                this.movimentoInicial &&
                this.estaDentroDoTabuleiro(linhaDuasFrentes, this.coluna) &&
                !tabuleiro.tabuleiro[linhaDuasFrentes][this.coluna].peca
            ) {
                movimentos.push({ linha: linhaDuasFrentes, coluna: this.coluna });
            }
        }

        for (const deslocamentoColuna of [-1, 1]) {
            const linhaDiagonal = linhaFrente;
            const colunaDiagonal = this.coluna + deslocamentoColuna;

            if (this.estaDentroDoTabuleiro(linhaDiagonal, colunaDiagonal)) {
                const casaDiagonal = tabuleiro.tabuleiro[linhaDiagonal][colunaDiagonal];
                if (casaDiagonal.peca && casaDiagonal.peca.cor !== this.cor) {
                    movimentos.push({ linha: linhaDiagonal, coluna: colunaDiagonal });
                }
            }
        }

        return movimentos;
    }

    moverPara(novaLinha, novaColuna) {
        super.moverPara(novaLinha, novaColuna);

        this.movimentoInicial = false;

        if ((this.cor === 'branca' && novaLinha === 0) || (this.cor === 'preta' && novaLinha === 7)) {
            this.promover();
        }
    }

    promover() {
        this.simbolo = this.cor === 'branca' ? '&#9813;' : '&#9819;';
        this.movimentosPossiveis = function () {
            return [];
        };
    }

    estaDentroDoTabuleiro(linha, coluna) {
        return linha >= 0 && linha < 8 && coluna >= 0 && coluna < 8;
    }
}


class Torre extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9814;' : '&#9820;';
    }

    movimentosPossiveis(tabuleiro) {
        return this.moverLinhaColuna(tabuleiro);
    }

    moverLinhaColuna(tabuleiro) {
        const movimentos = [];
        const direcoes = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        for (const [dLinha, dColuna] of direcoes) {
            let novaLinha = this.linha;
            let novaColuna = this.coluna;

            while (true) {
                novaLinha += dLinha;
                novaColuna += dColuna;

                if (novaLinha < 0 || novaLinha >= 8 || novaColuna < 0 || novaColuna >= 8) break;

                const casa = tabuleiro[novaLinha][novaColuna];
                if (casa.peca) {
                    if (casa.peca.cor !== this.cor) {
                        movimentos.push({ linha: novaLinha, coluna: novaColuna });
                    }
                    break;
                }

                movimentos.push({ linha: novaLinha, coluna: novaColuna });
            }
        }

        return movimentos;
    }
}

class Cavalo extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9816;' : '&#9822;';
    }

    movimentosPossiveis(tabuleiro) {
        const movimentos = [];
        const saltos = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2],
        ];

        for (const [dLinha, dColuna] of saltos) {
            const novaLinha = this.linha + dLinha;
            const novaColuna = this.coluna + dColuna;

            if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
                const casa = tabuleiro[novaLinha][novaColuna];
                if (!casa.peca || casa.peca.cor !== this.cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
            }
        }

        return movimentos;
    }
}

class Bispo extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9815;' : '&#9821;';
    }

    movimentosPossiveis(tabuleiro) {
        return this.moverDiagonal(tabuleiro);
    }

    moverDiagonal(tabuleiro) {
        const movimentos = [];
        const direcoes = [[1, 1], [-1, -1], [1, -1], [-1, 1]];

        for (const [dLinha, dColuna] of direcoes) {
            let novaLinha = this.linha;
            let novaColuna = this.coluna;

            while (true) {
                novaLinha += dLinha;
                novaColuna += dColuna;

                if (novaLinha < 0 || novaLinha >= 8 || novaColuna < 0 || novaColuna >= 8) break;

                const casa = tabuleiro[novaLinha][novaColuna];
                if (casa.peca) {
                    if (casa.peca.cor !== this.cor) {
                        movimentos.push({ linha: novaLinha, coluna: novaColuna });
                    }
                    break;
                }

                movimentos.push({ linha: novaLinha, coluna: novaColuna });
            }
        }

        return movimentos;
    }
}

class Rainha extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9813;' : '&#9819;';
    }

    movimentosPossiveis(tabuleiro) {
        return [
            ...this.moverLinhaColuna(tabuleiro),
            ...this.moverDiagonal(tabuleiro)
        ];
    }

    moverLinhaColuna(tabuleiro) {
        return new Torre(this.cor, this.linha, this.coluna).moverLinhaColuna(tabuleiro);
    }

    moverDiagonal(tabuleiro) {
        return new Bispo(this.cor, this.linha, this.coluna).moverDiagonal(tabuleiro);
    }
}

class Rei extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9812;' : '&#9818;';
    }

    movimentosPossiveis(tabuleiro) {
        const movimentos = [];
        const direcoes = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1],
        ];

        for (const [dLinha, dColuna] of direcoes) {
            const novaLinha = this.linha + dLinha;
            const novaColuna = this.coluna + dColuna;

            if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
                const casa = tabuleiro[novaLinha][novaColuna];
                if (!casa.peca || casa.peca.cor !== this.cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
            }
        }

        return movimentos;
    }
}

const tabuleiro = new Tabuleiro();

const pecasBrancas = [
    new Torre('branca', 0, 0), new Cavalo('branca', 0, 1), new Bispo('branca', 0, 2), new Rainha('branca', 0, 3),
    new Rei('branca', 0, 4), new Bispo('branca', 0, 5), new Cavalo('branca', 0, 6), new Torre('branca', 0, 7),
    ...Array.from({ length: 8 }, (_, col) => new Peao('branca', 1, col))
];

const pecasPretas = [
    new Torre('preta', 7, 0), new Cavalo('preta', 7, 1), new Bispo('preta', 7, 2), new Rainha('preta', 7, 3),
    new Rei('preta', 7, 4), new Bispo('preta', 7, 5), new Cavalo('preta', 7, 6), new Torre('preta', 7, 7),
    ...Array.from({ length: 8 }, (_, col) => new Peao('preta', 6, col))
];

pecasBrancas.forEach(peca => tabuleiro.colocarPeca(peca, peca.linha, peca.coluna));
pecasPretas.forEach(peca => tabuleiro.colocarPeca(peca, peca.linha, peca.coluna));
