import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosService } from "../../../utils/services/investimentos.service";
import { RouterLink } from "@angular/router";
import { InvestimentoDTO } from "../../../utils/models/InvestimentoDTO";
import { TiraInvestimentoComponent } from "../../../utils/components/tira-investimento/tira-investimento.component";
import { InvestimentoFiltro } from "../../../utils/models/InvestimentoFiltro";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";
import { DataUtilService } from "../../../utils/services/data-util.service";
import { CustoService } from "../../../utils/services/custo.service";
import { ObjetosService } from "../../../utils/services/objetos.service";

@Component({
    selector: 'spo-investimentos',
    templateUrl: './investimentos.component.html',
    styleUrl: './investimentos.component.scss',
    standalone: true,
    imports: [
        CommonModule, TiraInvestimentoComponent, RouterLink,
        ReactiveFormsModule, InvestimentoFiltroComponent, 
        FontAwesomeModule, ValorCardComponent
    ]
})
export class InvestimentosComponent implements AfterViewInit {

    searchIcon = faMagnifyingGlass;

    @ViewChild(InvestimentoFiltroComponent) filtroComponent! : InvestimentoFiltroComponent;

    totalPrevisto : number;
    totalHomologado : number;
    totalAutorizado : number;
    totalDisponivel : number;

    filtro : InvestimentoFiltro = { qtPorPag: 15, numPag: 1 };

    txtBusca = new FormControl('');

    data : InvestimentoDTO[] = [];
    paginas : number[] = [];
    qtObjetos = 0;
    qtInvestimento = 0;

    paginaAtual = 1;
    maxPgNum : number;
    larguraPaginacao = 7;

    constructor( 
        private service: InvestimentosService,
        private custoService: CustoService,
        private objetoService: ObjetosService,
        private dataUtilService : DataUtilService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.updateFiltro() )
        this.filtroComponent.form.valueChanges.subscribe(value => this.updateFiltro())

    }

    updateFiltro(){

        this.filtro = {
            exercicio: this.filtroComponent.form.get("exercicio").value,
            codPO: this.filtroComponent.form.get("planoOrcamentarioControl").value,
            codUnidade: this.filtroComponent.form.get("unidadeOrcamentariaControl").value,
            nome: this.txtBusca.value,
            numPag: this.paginaAtual,
            qtPorPag: 15
        }

        this.recarregarLista();
    }

    recarregarLista() {

        this.totalPrevisto = 0;
        this.totalHomologado = 0;
        this.totalAutorizado = 0;
        this.totalDisponivel = 0;

        this.qtObjetos = 0;

        this.qtInvestimento = 0;

        this.custoService.getTotalPrevisto(this.filtro.exercicio).subscribe(totalPrevisto => {
            this.totalPrevisto = totalPrevisto;
        })

        this.custoService.getTotalHomologado(this.filtro.exercicio).subscribe(totalContratado => {
            this.totalHomologado = totalContratado
        })

        this.service.getListaInvestimentos(this.filtro).subscribe(invs => {
            this.data = invs;
               

        });

        this.filtro.numPag = null;
        this.filtro.qtPorPag = null;
        this.paginas = [];
        this.service.getQuantidadeItens(this.filtro).subscribe(quantidade => {
            this.qtInvestimento = quantidade
            this.maxPgNum = Math.ceil(quantidade / 15);
            this.setPaginaAtual(Math.min(this.paginaAtual, this.maxPgNum));

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
            
            
        })
        

        this.objetoService.getQuantidadeItens(this.filtro).subscribe(quantidade => {
            this.qtObjetos = quantidade;
        })
       
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
            this.paginaAtual = pag;
            this.updateFiltro();
    }


    voltaUmaPagina() {
        if(this.paginaAtual > 1){
            this.paginaAtual--;
            this.updateFiltro();
        }
    }

    avancarUmaPagina() {
        if(this.paginaAtual < this.maxPgNum){
            this.paginaAtual++;
            this.updateFiltro();
        }
    }
}