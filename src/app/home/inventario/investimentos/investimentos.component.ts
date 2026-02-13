import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosService } from "../../../utils/services/investimentos.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { combineLatest, concat, finalize, merge, Observable, take, tap } from "rxjs";
import { InfosService } from "../../../utils/services/infos.service";
import { IFiltroInvestimento } from "./investimento-filtro/IFiltroInvestimento";
import { InvestimentoTiraDTO } from "../../../utils/models/InvestimentoTiraDTO";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";
import { InvestimentoOrdenacaoComponent } from "./investimento-ordenacao/investimento-ordenacao.component";
import { IOrdemItem } from "../../../utils/interfaces/ordem-item.interface";
import { CampoPesquisaComponent } from "../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { TiraListaComponent } from "../../../utils/components/tira-lista/tira-lista.component";
import { DEFAULT_OPENCLOSE_ACTION, TiraListaCol, TiraRecord } from "../../../utils/components/tira-lista/TiraListaConfig";

@Component({
    selector: 'spo-investimentos',
    templateUrl: './investimentos.component.html',
    styleUrl: './investimentos.component.scss',
    imports: [
    CommonModule, ProgressSpinnerModule,
    ReactiveFormsModule, InvestimentoFiltroComponent, TiraListaComponent,
    FontAwesomeModule, ValorCardComponent, BarraPaginacaoComponent,
    ProgressModalComponent,
    InvestimentoOrdenacaoComponent,
    CampoPesquisaComponent
]
})
export class InvestimentosComponent implements AfterViewInit {

    searchIcon = faMagnifyingGlass;


    @ViewChild(InvestimentoFiltroComponent) filtroComponent! : InvestimentoFiltroComponent;
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;
    @ViewChild(InvestimentoOrdenacaoComponent) ordenacaoComponent : InvestimentoOrdenacaoComponent;


    totalPlanejado : number = 0;
    totalHomologado : number = 0;
    totalOrcado : number = 0;
    totalAutorizado : number = 0;
    totalEmpenhado : number = 0;
    totalLiquidado : number = 0;
    totalDispSReserva : number = 0;
    totalPago : number = 0;

    filtro : IFiltroInvestimento;
    ordem : IOrdemItem[];

    txtBusca = new FormControl('');

    data : InvestimentoTiraDTO[] = [];
    dataRecord : TiraRecord<InvestimentoTiraDTO>[];

    qtInvestimento = 0;
    larguraPaginacao = 7;
    qtPorPagina = 15;

    showProgress = false;

    clickFunc = DEFAULT_OPENCLOSE_ACTION;

    constructor( 
        private service: InvestimentosService,
        private infoService : InfosService
    ) {
        
    }

    lock = true;

    gerarRecord(data: InvestimentoTiraDTO[]) : TiraRecord<InvestimentoTiraDTO>[] {
        return data.map(d => new TiraRecord({
            dado: d,
            config: [
                new TiraListaCol({ titulo: "Investimento", caminhoValor: "nome", tipo: "propLongo", largura: "5fr" }),
                new TiraListaCol({ titulo: "Unidade", caminhoValor: "unidadeOrcamentaria" }),
                new TiraListaCol({ titulo: "Código PO", caminhoValor: "codPO" }),
                new TiraListaCol({ titulo: "Planejado", caminhoValor: "totalPlanejado", tipo: "propDinheiro" }),
                new TiraListaCol({ titulo: "Contratado", caminhoValor: "totalContratado", tipo: "propDinheiro" }),
                new TiraListaCol({ titulo: "Autorizado", caminhoValor: "totalAutorizado", tipo: "propDinheiro" }),
                new TiraListaCol({ titulo: "Empenhado", caminhoValor: "totalEmpenhado", tipo: "propDinheiro" }),
                new TiraListaCol({ titulo: "Disp. S/ Reserva", caminhoValor: "totalDisponivel", tipo: "propDinheiro" }),
            ],
            filhos: d.objetos.map(obj => new TiraRecord({
                dado: obj,
                config: [
                    new TiraListaCol({ titulo: "Objeto", caminhoValor: "nome", tipo: "propLongo", largura: '5fr' }),
                    new TiraListaCol({ titulo: "Status", caminhoValor: "status" }),
                    new TiraListaCol({ titulo: "Tipo", caminhoValor: "tipo" }),
                    new TiraListaCol({ titulo: "Planejado", caminhoValor: "totalPlanejado", tipo: "propDinheiro" }),
                    new TiraListaCol({ titulo: "Contratado", caminhoValor: "totalContratado", tipo: "propDinheiro" }),
                    new TiraListaCol({ titulo: "Autorizado", caminhoValor: "totalAutorizado", tipo: "propDinheiro" }),
                    new TiraListaCol({ titulo: "Empenhado", caminhoValor: "totalEmpenhado", tipo: "propDinheiro" }),
                    new TiraListaCol({ titulo: "Disp. S/ Reserva", caminhoValor: "totalDisponivel", tipo: "propDinheiro" })
                ]
            }))
        }))
    }

    ngAfterViewInit(): void {
        

        combineLatest([
            this.filtroComponent.filterChange,
            this.ordenacaoComponent.onChange
        ]).pipe(take(1)).subscribe(([filtro, ordem]) => {
            this.txtBusca.valueChanges.subscribe(value => this.setFiltro(filtro) );
            this.executar(
                concat(
                    this.recarregarValores(filtro),
                    this.recarregarLista(1, ordem)
                ).pipe(finalize(() => this.lock = false))
            );
        })
    }

    setFiltro(filtro : IFiltroInvestimento) {
        this.filtro = {
            ano: filtro.ano,
            planos: filtro.planos && filtro.planos.length > 0 ? filtro.planos : undefined,
            unidades: filtro.unidades && filtro.unidades.length > 0 ? filtro.unidades : undefined,
            fonte: filtro.fonte,
            nome: this.txtBusca.value,
            gnd: filtro.gnd,
            podeVerUnidades: filtro.podeVerUnidades,
            numPag: filtro.numPag,
            qtPorPag: filtro.qtPorPag,
        }

        if(!this.lock)
            this.executar(
                concat(
                    this.recarregarValores(this.filtro),
                    this.recarregarLista(1)
                )
            );
         
    }

    executar(acao : Observable<any>) {
        this.showProgress = true;

        acao.pipe(finalize(() => this.showProgress = false)).subscribe()
    }

    recarregarValores(filtro : IFiltroInvestimento) {

        return merge(

            this.infoService.getCardTotais(
                this.txtBusca.value,
                filtro.unidades && filtro.unidades.length > 0 ? filtro.unidades.map(u => u.id) : undefined,
                filtro.planos && filtro.planos.length > 0 ? filtro.planos.map(p => p.id) : undefined,
                filtro.fonte?.id,
                Number(this.filtro.ano),
                filtro.gnd,
                filtro.podeVerUnidades
            )
            .pipe(tap(totais => {
                
                if(!totais) return;

                this.totalPlanejado = totais.planejado;
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

    setOrdem(novaOrdem : IOrdemItem[]) {
        if(this.filtro)
            this.ordem = novaOrdem;
        

        if(!this.lock)
            this.executar(this.recarregarLista(this.filtro?.numPag, novaOrdem));
    }

    recarregarLista(novaPagina : number, novaOrdem? : IOrdemItem[]) {

        this.filtro.numPag = novaPagina;

        if(novaOrdem)
            this.ordem = novaOrdem;
        
         return merge(
            this.service.getListaTiraInvestimentos(this.filtro, this.ordem)
            .pipe(tap(invs => {
                this.dataRecord = this.gerarRecord(invs.data);
                this.qtInvestimento = invs.ammount;
                this.barraPaginacaoComponent.updatePaginacao(invs.ammount);
            }))
        )
       
    }
}