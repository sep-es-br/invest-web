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
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ExecucaoOrcamentariaService } from "../../../utils/services/execucaoOrcamentaria.service";
import { concat, merge, tap } from "rxjs";

@Component({
    selector: 'spo-investimentos',
    templateUrl: './investimentos.component.html',
    styleUrl: './investimentos.component.scss',
    standalone: true,
    imports: [
        CommonModule, TiraInvestimentoComponent,
        ReactiveFormsModule, InvestimentoFiltroComponent, 
        FontAwesomeModule, ValorCardComponent, BarraPaginacaoComponent
    ]
})
export class InvestimentosComponent implements AfterViewInit {

    searchIcon = faMagnifyingGlass;

    @ViewChild(InvestimentoFiltroComponent) filtroComponent! : InvestimentoFiltroComponent;
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    totalPrevisto : number = 0;
    totalHomologado : number = 0;
    totalOrcado : number = 0;
    totalAutorizado : number = 0;
    totalDisponivel : number = 0;

    filtro : InvestimentoFiltro = { qtPorPag: 15, numPag: 1 };

    txtBusca = new FormControl('');

    data : InvestimentoDTO[] = [];

    qtInvestimento = 0;
    larguraPaginacao = 7;
    qtPorPagina = 15;

    constructor( 
        private service: InvestimentosService,
        private custoService: CustoService,
        private execucaoService: ExecucaoOrcamentariaService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.updateFiltro(1) )
        this.filtroComponent.form.valueChanges.subscribe(value => this.updateFiltro(1))

    }

    updateFiltro(novaPagina : number){

        this.filtro = {
            exercicio: this.filtroComponent.form.get("exercicio").value,
            codPO: this.filtroComponent.form.get("planoOrcamentarioControl").value,
            codUnidade: this.filtroComponent.form.get("unidadeOrcamentariaControl").value,
            idFonte: this.filtroComponent.form.get("fonteOrcamentariaControl").value,
            nome: this.txtBusca.value,
            numPag: novaPagina,
            qtPorPag: 15
        }

        this.recarregarLista(novaPagina);
    }


    recarregarLista(novaPagina : number) {

        this.filtro.numPag = novaPagina;

        merge(

            this.custoService.getValoresTotaisCusto(this.filtro.exercicio)
            .pipe(tap(totais => {
                this.totalPrevisto = totais.previsto;
                this.totalHomologado = totais.contratado; 
            })),

            this.execucaoService.getTotalOrcado(this.filtro.exercicio)
            .pipe(tap(totalOrcado => {
                this.totalOrcado = totalOrcado
            })),

            this.service.getListaInvestimentos(this.filtro)
            .pipe(tap(invs => {
                this.data = invs;
            })),

            this.service.getQuantidadeItens(this.filtro)
            .pipe(tap(quantidade => {
                this.qtInvestimento = quantidade
                this.barraPaginacaoComponent.updatePaginacao(quantidade);  
            }))

        ).subscribe()
       
    }
}