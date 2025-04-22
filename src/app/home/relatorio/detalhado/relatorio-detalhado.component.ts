import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFileDownload, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { catchError, concat, finalize, merge, Observable, tap } from "rxjs";
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { IFiltroInvestimento, IFiltroInvestimentoComPag } from "./investimento-filtro/IFiltroInvestimento";
import { ContaService } from "../../../utils/services/conta.service";
import { ErrorHandlerService } from "../../../utils/services/error-handler.service";
import { IDadoDetalhado } from "../../../utils/interfaces/dado-detalhado.interface";
import { TiraDadoDetalhadoComponent } from "./tira-rel-detalhado/tira-dado-detalhado.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { PlanoOrcamentarioDTO } from "../../../utils/models/PlanoOrcamentarioDTO";
import { TipoDespesaEnum } from "../../../utils/enum/tipoDespesa.enum";
import { RelatorioService } from "../../../utils/services/relatorio.service";

@Component({
    templateUrl: "./relatorio-detalhado.component.html",
    styleUrl: "./relatorio-detalhado.component.scss",
    imports: [
        CommonModule, BarraPaginacaoComponent, FontAwesomeModule,
        ReactiveFormsModule, ProgressModalComponent, InvestimentoFiltroComponent,
        TiraDadoDetalhadoComponent, FontAwesomeModule, NgSelectModule
    ]
})
export class RelatorioDetalhadoComponent implements AfterViewInit {

    
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    searchIcon = faMagnifyingGlass;
    downloadIcon = faFileDownload;

    txtBusca = new FormControl(undefined);

    selectAno = new FormControl(new Date().getFullYear());

    qtDados = 0;
    larguraPaginacao = 7;
    
    showProgress = false;

    data : IDadoDetalhado[] = [];

    datas : number[] = [];
    
    filtroCompleto : Partial<IFiltroInvestimento> = {}

    filtro : IFiltroInvestimentoComPag = {
        ...this.filtroCompleto,
        exercicio: new Date().getFullYear(),
        pag: 1, 
        pagSize: 15,
     };

    constructor(
        private contaService : ContaService,
        private errorHandler : ErrorHandlerService,
        private relatorioService : RelatorioService
    ){}

    ngAfterViewInit(): void {
        this.selectAno.valueChanges.subscribe(value => {
            this.mudarAno(value);
        })
    }

    executar(acao : Observable<any>) {
        this.showProgress = true;

        acao.pipe(
            catchError(err => this.errorHandler.handleError(err)),
            finalize(() => this.showProgress = false)
        ).subscribe()
    }

    atualizarFiltro(filtro : Partial<IFiltroInvestimento>, novaPagina : number) {
        
        this.filtroCompleto = filtro;

        this.filtro = {
            ...this.filtro,
            ...filtro,
            exercicio: this.selectAno.value,
            pag: novaPagina
        }

        this.executar(
            concat(
                this.recarregarLista(novaPagina).pipe(finalize(
                    () => {
                        this.datas = [];
                        for(let i = filtro.anoDe; i <= filtro.anoAte; i++)
                            this.datas.push(i);

                        let esseAno = new Date().getFullYear();

                        if(this.datas.includes(esseAno))
                            this.selectAno.setValue(esseAno);
                        else if(esseAno > filtro.anoAte)
                            this.selectAno.setValue(filtro.anoAte);
                        else 
                            this.selectAno.setValue(filtro.anoDe);
                    }
                ))
            )
        );
        
    }

    mudarAno(novoAno : number) {
        this.filtro.exercicio = novoAno;
        this.executar(this.recarregarLista(1));
    }

    gerarRelatorio() {
        this.executar(this.relatorioService.gerarRelatorio(this.filtroCompleto).pipe(
            catchError(err => this.errorHandler.handleError(err))
        ));
    }
    
    recarregarLista(novaPagina : number) {

        this.filtro.pag = novaPagina;

         return merge(
            this.contaService.getDadosDetalhados(this.filtro)
            .pipe(tap(dados => {
                this.data = dados.data;
                this.qtDados = dados.ammount;
                this.barraPaginacaoComponent.updatePaginacao(dados.ammount);
            }))
        )
       
    }
}