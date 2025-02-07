import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ObjetosService } from "../../../../../utils/services/objetos.service";
import { IFiltro, ObjetoFiltroComponent } from "./objetos-filtro/objetos-filtro.component";
import { TiraObjetoComponent } from "../../../../../utils/components/tira-objeto/tira-objeto.component";
import { ObjetoFiltro } from "../../../../../utils/models/ObjetoFiltro";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { DataUtilService } from "../../../../../utils/services/data-util.service";
import { BarraPaginacaoComponent } from "../../../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ObjetoTiraDTO } from "../../../../../utils/models/ObjetoTiraDTO";
import { IObjetoFiltro } from "../../../../../utils/interfaces/objetoFiltro.interface";
import { RouterModule } from "@angular/router";
import { concat, merge, tap } from "rxjs";
import { EtapaService } from "../../../../../utils/services/etapa.service";

@Component({
    selector: "spo-avaliacao",
    templateUrl: "./avaliacao-listagem.component.html",
    styleUrl: "./avaliacao-listagem.component.scss",
    standalone: true,
    imports: [
    CommonModule, ReactiveFormsModule, ObjetoFiltroComponent,
    TiraObjetoComponent, FontAwesomeModule,
    BarraPaginacaoComponent, RouterModule
]
})
export class AvaliacaoListagemComponent implements AfterViewInit{

    searchIcon = faMagnifyingGlass;

    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;
    @ViewChild(ObjetoFiltroComponent) private filtroComponent : ObjetoFiltroComponent;
    txtBusca = new FormControl('');

    data : ObjetoTiraDTO[] = [];

    filtro : IObjetoFiltro;

    paginaAtual = 1;

    qtObjetos = 0;
    larguraPaginacao = 7;

    constructor(
        private service: ObjetosService,
        private dataUtilService : DataUtilService,
        private etapaService : EtapaService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.recarregarLista(this.paginaAtual));
        this.recarregarLista(this.paginaAtual);
        
    }

    updateFiltro(){

        this.filtro = {
            exercicio : this.filtroComponent.filtro.ano,
            status : this.filtroComponent.filtro.status,
            unidade : this.filtroComponent.filtro.unidade,
            etapa: this.filtroComponent.filtro.etapa,
            nome: this.txtBusca.value
        };
    }

    recarregarLista(novaPagina : number) {

        this.updateFiltro()

        this.paginaAtual = novaPagina;

        concat(
            this.service.getListaTiraObjetosEmProcessamento(this.filtro, novaPagina, 15).pipe(
                tap(invs => {
                    this.data = invs;
                })
            ),
            this.service.getQuantidadeItensEmProcessamento(this.filtro).pipe(
                tap(quantidade => {
                    this.qtObjetos = quantidade
                    this.barraPaginacaoComponent.updatePaginacao(quantidade);  
                })
            )
        ).subscribe()
       
    }

    voltaUmaPagina() {
        if(this.paginaAtual > 1)
            this.paginaAtual--
    }

    avancarUmaPagina() {
        if(this.paginaAtual < this.data.length)
            this.paginaAtual++
    }
}