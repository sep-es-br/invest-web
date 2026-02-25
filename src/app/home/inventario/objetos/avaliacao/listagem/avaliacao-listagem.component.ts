import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ObjetosService } from "../../../../../utils/services/objetos.service";
import { ObjetoFiltroComponent } from "./objetos-filtro/objetos-filtro.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { BarraPaginacaoComponent } from "../../../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ObjetoTiraDTO } from "../../../../../utils/models/ObjetoTiraDTO";
import { IObjetoFiltro } from "../../../../../utils/interfaces/objetoFiltro.interface";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { concat, tap } from "rxjs";
import { IPodeDTO } from "../../../../../utils/models/PodeDto";
import { PermissaoService } from "../../../../../utils/services/permissao.service";
import { CampoPesquisaComponent } from "../../../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { TiraListaCol, TiraRecord } from "../../../../../utils/components/tira-lista/TiraListaConfig";
import { TiraListaComponent } from "../../../../../utils/components/tira-lista/tira-lista.component";

@Component({
    selector: "spo-avaliacao",
    templateUrl: "./avaliacao-listagem.component.html",
    styleUrl: "./avaliacao-listagem.component.scss",
    imports: [
    CommonModule, ReactiveFormsModule, ObjetoFiltroComponent,
    FontAwesomeModule, TiraListaComponent,
    BarraPaginacaoComponent, RouterModule,
    CampoPesquisaComponent
]
})
export class AvaliacaoListagemComponent implements AfterViewInit{

    searchIcon = faMagnifyingGlass;

    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;
    @ViewChild(ObjetoFiltroComponent) private filtroComponent : ObjetoFiltroComponent;
    txtBusca = new FormControl('');

    objetosLista : TiraRecord<ObjetoTiraDTO>[];

    filtro : IObjetoFiltro;

    paginaAtual = 1;

    qtObjetos = 0;
    larguraPaginacao = 7;

    pode : IPodeDTO

    constructor(
        private service: ObjetosService,
        private permissaoService : PermissaoService,
        private router : Router,
        private route : ActivatedRoute
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.recarregarLista(this.paginaAtual));
        this.permissaoService.getPermissao("inventarioobjetos").pipe(
            tap(pode => {
                this.pode = pode
                this.pode.excluir = false;
                this.recarregarLista(this.paginaAtual);
            })
        ).subscribe()
        
        
    }

    updateFiltro(){

        this.filtro = {
            exercicio : this.filtroComponent.filtro.ano,
            status : this.filtroComponent.filtro.status,
            unidades : this.filtroComponent.filtro.unidade,
            etapa: this.filtroComponent.filtro.etapa,
            gnd: this.filtroComponent.filtro.gnd,
            nome: this.txtBusca.value,
            podeVerUnidades: !!this.pode.verTodasUnidades
        };
    }

    redirectTo(path : string) {
        if(!this.pode?.visualizar) return;

        this.router.navigate([path], {relativeTo: this.route})
    }

    clickFunc = (item: TiraRecord<ObjetoTiraDTO>) => {
        if(!this.pode.visualizar) return;

        this.redirectTo(item.dado.id.toString());
    }

    recarregarLista(novaPagina : number) {
        this.updateFiltro()

        this.paginaAtual = novaPagina;

        concat(
            this.service.getListaTiraObjetosEmProcessamento(this.filtro, novaPagina, 15).pipe(
                tap(({data, ammount}) => {

                   let config = [
                            new TiraListaCol({ titulo: "Objeto", caminhoValor: 'nome', tipo: 'propLongo', largura: '5fr' }),
                            new TiraListaCol({ titulo: "Tipo", caminhoValor: 'tipo' }),
                            new TiraListaCol({ titulo: "Unidade", caminhoValor: 'unidadeResponsavel', largura: '8rem' }),
                            new TiraListaCol({ titulo: "Código PO", caminhoValor: 'codPO', valorDefault: 'Sem PO' }),
                            new TiraListaCol({ titulo: "Planejado", caminhoValor: 'totalPlanejado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Contratado", caminhoValor: 'totalContratado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Autorizado", caminhoValor: 'totalAutorizado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Empenhado", caminhoValor: 'totalEmpenhado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Disp. S/ Reserva", caminhoValor: 'totalDisponivel', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Status", caminhoValor: 'status'})
                        ]

                    this.objetosLista = data.map(obj => new TiraRecord<ObjetoTiraDTO> ({
                        dado: obj,
                        config: config
                    }));
                    this.qtObjetos = ammount
                    this.barraPaginacaoComponent.updatePaginacao(ammount);  
                })
            )
        ).subscribe()
       
    }
}