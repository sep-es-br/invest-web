import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'spo-barra-paginacao',
    standalone: true,
    templateUrl: './barra-paginacao.component.html',
    styleUrl: './barra-paginacao.component.scss',
    imports: [CommonModule]
})
export class BarraPaginacaoComponent implements AfterViewInit {
    
    @Input() quantidade : number;
    @Input() larguraPaginacao = 7;

    @Output() onPageChange = new EventEmitter<number>();

    paginas : number[] = [];

    paginaAtual = 1;
    maxPgNum : number;

    ngAfterViewInit(): void {
        this.updatePaginacao();
    }

    updatePaginacao(quantidade? : number){
        this.paginas = [];
        if(quantidade) this.quantidade = quantidade;

        this.maxPgNum = Math.ceil(this.quantidade / 15);

        let metadeTam = Math.floor(this.larguraPaginacao / 2);
        let meio = this.paginaAtual;

        if(this.maxPgNum < this.larguraPaginacao) {
            meio = Math.floor(this.maxPgNum / 2);
        } else {
            meio = Math.max(meio, 1 + metadeTam)
            meio = Math.min(meio, this.maxPgNum-metadeTam)
        }
        
        let numMin = Math.max(1, meio - metadeTam);
        let numMax = Math.min(meio + metadeTam, this.maxPgNum)

        for(let i = numMin; i < numMax+1; i++){
            this.paginas.push(i)
        }
    }

    vaiParaPrimeiraPagina(){
        if(this.paginaAtual != 1) {
            this.setPaginaAtual(1);
        }
    }

    vaiParaUltimaPagina(){
        if(this.paginaAtual != this.maxPgNum) {
            this.setPaginaAtual(this.maxPgNum);
        }
    }

    setPaginaAtual(pag : number) {
        if(this.paginaAtual === pag) return;
        this.paginaAtual = Math.min(pag, this.maxPgNum);
        this.updatePaginacao();
        this.onPageChange.emit(this.paginaAtual);
    }


    voltaUmaPagina() {
        if(this.paginaAtual > 1)
            this.setPaginaAtual(this.paginaAtual - 1);
        
    }

    avancarUmaPagina() {
        if(this.paginaAtual < this.maxPgNum)
            this.setPaginaAtual(this.paginaAtual + 1);
    }
}