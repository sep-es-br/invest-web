import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFileDownload, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { catchError, concat, finalize, merge, Observable, tap } from "rxjs";
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { IDadoConsolidadoFiltro, IDadoConsolidadoFiltroComPag } from "./investimento-filtro/dado-consolidado-filtro.interface";
import { ContaService } from "../../../utils/services/conta.service";
import { ErrorHandlerService } from "../../../utils/services/error-handler.service";
import { IDadoDetalhado } from "../../../utils/interfaces/dado-detalhado.interface";
import { TiraDadoConsolidadoComponent } from "./tira-rel-consolidado/tira-dado-consolidado.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { PlanoOrcamentarioDTO } from "../../../utils/models/PlanoOrcamentarioDTO";
import { TipoDespesaEnum } from "../../../utils/enum/tipoDespesa.enum";
import { RelatorioService } from "../../../utils/services/relatorio.service";
import { IDadoConsolidado } from "../../../utils/interfaces/dado-consolidado.interface";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";

@Component({
    templateUrl: "./relatorio-consolidado.component.html",
    styleUrl: "./relatorio-consolidado.component.scss",
    imports: [
    CommonModule, BarraPaginacaoComponent, FontAwesomeModule,
    ReactiveFormsModule, ProgressModalComponent, InvestimentoFiltroComponent,
    TiraDadoConsolidadoComponent, FontAwesomeModule, NgSelectModule,
    ValorCardComponent
]
})
export class RelatorioConsolidadoComponent {

    
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    searchIcon = faMagnifyingGlass;
    downloadIcon = faFileDownload;

    txtBusca = new FormControl(undefined);

    qtDados = 0;
    larguraPaginacao = 7;
    
    showProgress = false;

    data : IDadoConsolidado[] = [];

    datas : number[] = [];
    
    filtroCompleto : Partial<IDadoConsolidadoFiltro> = {}

    filtro : IDadoConsolidadoFiltroComPag = {
        ...this.filtroCompleto,
        pag: 1, 
        pagSize: 15,
    };

    totalPrevisto : number;
    totalContratado : number;
    totalAutorizado : number;
    totalDifAutorizadoContratado : number;     

    constructor(
        private contaService : ContaService,
        private errorHandler : ErrorHandlerService,
        private relatorioService : RelatorioService
    ){}

    executar(acao : Observable<any>) {
        this.showProgress = true;

        acao.pipe(
            catchError(err => this.errorHandler.handleError(err)),
            finalize(() => this.showProgress = false)
        ).subscribe()
    }

    atualizarFiltro(filtro : Partial<IDadoConsolidadoFiltro>, novaPagina : number) {
        
        this.filtroCompleto = filtro;

        this.filtro = {
            ...this.filtro,
            ...filtro,
            pag: novaPagina
        }

        this.executar(
            merge(
                this.relatorioService.getValoresRelatorioConsolidado(filtro)
                .pipe(tap( valores => {
                    this.totalPrevisto = valores.previsto;
                    this.totalContratado = valores.contratado;
                    this.totalAutorizado = valores.autorizado;
                    this.totalDifAutorizadoContratado = valores.difAutorizadoContratado;
                } )),
                this.recarregarLista(novaPagina).pipe(finalize(
                    () => {
                        this.datas = [];
                        for(let i = filtro.anoDe; i <= filtro.anoAte; i++)
                            this.datas.push(i);

                    }
                ))
            )
        );
        
    }


    gerarRelatorio() {
        this.executar(this.relatorioService.gerarRelatorioConsolidado(this.filtroCompleto).pipe(
            catchError(err => this.errorHandler.handleError(err))
        ));
    }
    
    recarregarLista(novaPagina : number) {

        this.filtro.pag = novaPagina;

         return merge(
            this.contaService.getDadosConsolidados(this.filtro)
            .pipe(tap(dados => {
                this.data = dados.data;
                this.qtDados = dados.ammount;
                this.barraPaginacaoComponent.updatePaginacao(dados.ammount);
            }))
        )
       
    }
}