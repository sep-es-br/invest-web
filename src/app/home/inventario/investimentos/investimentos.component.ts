import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosService } from "../../../utils/services/investimentos.service";
import { TiraInvestimentoComponent } from "../../../utils/components/tira-investimento/tira-investimento.component";
import { InvestimentoFiltro } from "../../../utils/models/InvestimentoFiltro";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";
import { CustoService } from "../../../utils/services/custo.service";
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ExecucaoOrcamentariaService } from "../../../utils/services/execucaoOrcamentaria.service";
import { concat, finalize, merge, Observable, tap } from "rxjs";
import { InfosService } from "../../../utils/services/infos.service";
import { IFiltroInvestimento } from "./investimento-filtro/IFiltroInvestimento";
import { InvestimentoTiraDTO } from "../../../utils/models/InvestimentoTiraDTO";
import { ContaService } from "../../../utils/services/conta.service";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";

@Component({
    selector: 'spo-investimentos',
    templateUrl: './investimentos.component.html',
    styleUrl: './investimentos.component.scss',
    standalone: true,
    imports: [
    CommonModule, TiraInvestimentoComponent, ProgressSpinnerModule,
    ReactiveFormsModule, InvestimentoFiltroComponent,
    FontAwesomeModule, ValorCardComponent, BarraPaginacaoComponent,
    ProgressModalComponent
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
    totalEmpenhado : number = 0;
    totalLiquidado : number = 0;
    totalDispSReserva : number = 0;
    totalPago : number = 0;

    filtro : InvestimentoFiltro = { qtPorPag: 15, numPag: 1 };

    txtBusca = new FormControl('');

    data : InvestimentoTiraDTO[] = [];

    qtInvestimento = 0;
    larguraPaginacao = 7;
    qtPorPagina = 15;

    showProgress = false;

    constructor( 
        private service: InvestimentosService,
        private contaService : ContaService,
        private custoService: CustoService,
        private execucaoService: ExecucaoOrcamentariaService,
        private infoService : InfosService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.atualizarFiltro(this.filtroComponent.filtro, 1) );
    }

    atualizarFiltro(filtro : IFiltroInvestimento, novaPagina : number) {
        this.filtro = {
            exercicio: filtro.ano,
            codPO: filtro.plano?.id,
            codUnidade: filtro.unidade?.id,
            idFonte: filtro.fonte?.id,
            nome: this.txtBusca.value,
            numPag: novaPagina,
            qtPorPag: 15
        }

        this.executar(
            concat(
                this.recarregarValores(),
                this.recarregarLista(novaPagina)
            )
        );
        
    }

    executar(acao : Observable<any>) {
        this.showProgress = true;

        acao.pipe(finalize(() => this.showProgress = false)).subscribe()
    }

    recarregarValores() {

        return merge(

            this.infoService.getCardTotais(
                this.txtBusca.value,
                this.filtro.codUnidade,
                this.filtro.codPO,
                this.filtro.idFonte,
                Number(this.filtro.exercicio)
            )
            .pipe(tap(totais => {
                            
                this.totalPrevisto = totais.previsto;
                this.totalHomologado = totais.contratado;
                this.totalOrcado = totais.orcado;
                this.totalAutorizado = totais.autorizado;
                this.totalEmpenhado = totais.empenhado;
                this.totalLiquidado = totais.liquidado;
                this.totalDispSReserva = totais.dispSemReserva;
                this.totalPago = totais.pago;
            }))

        )
       
    }

    recarregarLista(novaPagina : number) {

        this.filtro.numPag = novaPagina;

         return merge(
            this.service.getListaTiraInvestimentos(this.filtro)
            .pipe(tap(invs => {
                this.data = invs.data;
                this.qtInvestimento = invs.ammount;
                this.barraPaginacaoComponent.updatePaginacao(invs.ammount);
            }))
        )
       
    }
}