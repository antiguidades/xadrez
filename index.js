class Tabuleiro {
    constructor() {
        this.nome = "Tabuleiro";

        this.tabuleiro = [];
        for (let linha = 0; linha < 8; linha++) {
            this.tabuleiro[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                this.tabuleiro[linha][coluna] = new Casa(linha, coluna);
            }
        }
        console.log(this.tabuleiro);

        this.selecionada = null;
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
            }
        } else if (casa.peca) {
            this.selecionada = casa;
        }
    }
}

class Peca {
    constructor(cor, linha, coluna) {
        this.cor = cor;
        this.linha = linha;
        this.coluna = coluna;
        this.simbolo = "";
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
    }

    movimentosPossiveis(tabuleiro) {
        const movimentos = [];
        const direcao = this.cor === 'branca' ? -1 : 1;

        if (!tabuleiro[this.linha + direcao]?.[this.coluna]?.peca) {
            movimentos.push({ linha: this.linha + direcao, coluna: this.coluna });
        }

        for (let deslocamento of [-1, 1]) {
            const alvo = tabuleiro[this.linha + direcao]?.[this.coluna + deslocamento];
            if (alvo && alvo.peca && alvo.peca.cor !== this.cor) {
                movimentos.push({ linha: this.linha + direcao, coluna: this.coluna + deslocamento });
            }
        }

        return movimentos;
    }
}

class Torre extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha, coluna);
        this.simbolo = cor === 'branca' ? '&#9814;' : '&#9820;';
    }

    movimentosPossiveis(tabuleiro) {
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

const tabuleiro = new Tabuleiro();

const pecasBrancas = [
    new Peao('branca', 1, 0), new Peao('branca', 1, 1), new Peao('branca', 1, 2), new Peao('branca', 1, 3),
    new Peao('branca', 1, 4), new Peao('branca', 1, 5), new Peao('branca', 1, 6), new Peao('branca', 1, 7),
    new Torre('branca', 0, 0), new Torre('branca', 0, 7)
];

const pecasPretas = [
    new Peao('preta', 6, 0), new Peao('preta', 6, 1), new Peao('preta', 6, 2), new Peao('preta', 6, 3),
    new Peao('preta', 6, 4), new Peao('preta', 6, 5), new Peao('preta', 6, 6), new Peao('preta', 6, 7),
    new Torre('preta', 7, 0), new Torre('preta', 7, 7)
];

pecasBrancas.forEach(peca => tabuleiro.colocarPeca(peca, peca.linha, peca.coluna));
pecasPretas.forEach(peca => tabuleiro.colocarPeca(peca, peca.linha, peca.coluna));


