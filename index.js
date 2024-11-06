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
    }

    colocarPeca(peca, linha, coluna) {
        const casa = this.tabuleiro[linha][coluna];
        casa.elementoHtml.innerHTML = peca.simbolo;
    }
}

class Casa {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
        this.peca = null;

        this.elementoHtml =  document.createElement('div')
        this.elementoHtml.classList.add('casa');

        if((linha + coluna) % 2 == 0) {
            this.elementoHtml.classList.add('clara')
        } else {
            this.elementoHtml.classList.add('escura')
        }
        document.getElementById('tabuleiro').appendChild(this.elementoHtml);
        console.log("foi");
    }
}

class Peca {
    constructor(cor, linha, coluna) {
        this.cor = cor;
        this.linha = linha;
        this.coluna = coluna;
        this.simbolo = "";
    }

    movimentosPossiveis() {
        return [];
    }

    moverPara(novaLinha, novaColuna) {
        this.linha = novaLinha;
        this.coluna = novaColuna;
    }
}


class Peao extends Peca {
    constructor(cor, linha, coluna) {
        super(cor, linha,coluna);
        this.simbolo = cor === 'preta' ? '&#9823' : '&#9823';
    }
}

const tabuleiro = new Tabuleiro();
peao = new Peao('preta', 1, 0);
tabuleiro.colocarPeca(peao, 1, 0);
peao = new Peao('preta', 1, 1);
tabuleiro.colocarPeca(peao, 1, 1);
peao = new Peao('preta', 1, 2);
tabuleiro.colocarPeca(peao, 1, 2);
peao = new Peao('preta', 1, 3);
tabuleiro.colocarPeca(peao, 1, 3);
peao = new Peao('preta', 1, 4);
tabuleiro.colocarPeca(peao, 1, 4);
peao = new Peao('preta', 1, 5);
tabuleiro.colocarPeca(peao, 1, 5);
peao = new Peao('preta', 1, 6);
tabuleiro.colocarPeca(peao, 1, 6);
peao = new Peao('preta', 1, 7);
tabuleiro.colocarPeca(peao, 1, 7);
alert(tabuleiro.nome);
