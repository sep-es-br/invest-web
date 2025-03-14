import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { catchError, concat, finalize, merge, Observable, tap } from "rxjs";
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { IFiltroInvestimento } from "./investimento-filtro/IFiltroInvestimento";
import { InvestimentoFiltro } from "../../../utils/models/InvestimentoFiltro";
import { ContaService } from "../../../utils/services/conta.service";
import { ErrorHandlerService } from "../../../utils/services/error-handler.service";
import { IDadoConsolidado } from "../../../utils/interfaces/dado-consolidado.interface";
import { TiraDadoConsolidadoComponent } from "./tira-rel-consolidado/tira-dado-consolidado.component";

@Component({
    standalone: true,
    templateUrl: "./relatorio-consolidado.component.html",
    styleUrl: "./relatorio-consolidado.component.scss",
    imports: [
        CommonModule, BarraPaginacaoComponent, ValorCardComponent, FontAwesomeModule,
        ReactiveFormsModule, ProgressModalComponent,InvestimentoFiltroComponent,
        TiraDadoConsolidadoComponent
    ]
})
export class RelatorioConsolidadoComponent {

    
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    searchIcon = faMagnifyingGlass;

    txtBusca = new FormControl(undefined);

    qtDados = 0;
    larguraPaginacao = 7;
    qtPorPagina = 15;
    
    showProgress = false;

    data : IDadoConsolidado[] = [];
    
    filtro = {
        exercicio: new Date().getFullYear(),
        pag: 1, 
        pagSize: 15
     };

    constructor(
        private contaService : ContaService,
        private errorHandler : ErrorHandlerService
    ){}

    executar(acao : Observable<any>) {
        this.showProgress = true;

        acao.pipe(
            catchError(err => this.errorHandler.handleError(err)),
            finalize(() => this.showProgress = false)
        ).subscribe()
    }

    atualizarFiltro(filtro : IFiltroInvestimento, novaPagina : number) {
        // this.filtro = {
        //     exercicio: filtro.ano,
        //     codPO: filtro.plano && filtro.plano.length > 0 ? filtro.plano.map(p => p.id) : undefined,
        //     codUnidade: filtro.unidade && filtro.unidade.length > 0 ? filtro.unidade.map(u => u.id) : undefined,
        //     idFonte: filtro.fonte?.id,
        //     nome: this.txtBusca.value,
        //     gnd: filtro.gnd,
        //     verUnidades: filtro.podeVerUnidades,
        //     numPag: novaPagina,
        //     qtPorPag: this.filtro.qtPorPag
        // }

        this.filtro = {
            ...this.filtro,
            pag: novaPagina,
            pagSize: this.filtro.pagSize
        }

        this.executar(
            concat(
                this.recarregarValores(),
                this.recarregarLista(novaPagina)
            )
        );
        
    }
    
    recarregarValores() {
    
        return merge(

            // this.infoService.getCardTotais(
            //     this.txtBusca.value,
            //     this.filtro.codUnidade,
            //     this.filtro.codPO,
            //     this.filtro.idFonte,
            //     Number(this.filtro.exercicio),
            //     this.filtro.gnd,
            //     this.filtro.verUnidades
            // )
            // .pipe(tap(totais => {
                            
            //     this.totalPrevisto = totais.previsto;
            //     this.totalHomologado = totais.contratado;
            //     this.totalOrcado = totais.orcado;
            //     this.totalAutorizado = totais.autorizado;
            //     this.totalEmpenhado = totais.empenhado;
            //     this.totalLiquidado = totais.liquidado;
            //     this.totalDispSReserva = totais.dispSemReserva;
            //     this.totalPago = totais.pago;
            // }))

        )
        
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