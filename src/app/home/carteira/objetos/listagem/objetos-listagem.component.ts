import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ObjetosFiltroComponent } from "./objetos-filtro/objetos-filtro.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ObjetoTiraDTO } from "../../../../utils/models/ObjetoTiraDTO";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { combineLatest, finalize, merge, Observable, take, tap } from "rxjs";
import { BarraPaginacaoComponent } from "../../../../utils/components/barra-paginacao/barra-paginacao.component";
import { IObjetoFiltro } from "../../../../utils/interfaces/objetoFiltro.interface";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { IPodeDTO } from "../../../../utils/models/PodeDto";
import { ObjetosOrdenacaoComponent } from "./objetos-ordenacao/objetos-ordenacao.component";
import { IOrdemItem } from "../../../../utils/interfaces/ordem-item.interface";
import { ProgressModalComponent } from "../../../../utils/components/progress-modal/progress-modal.component";
import { CampoPesquisaComponent } from "../../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { TiraListaComponent } from "../../../../utils/components/tira-lista/tira-lista.component";
import { TiraListaCol, TiraRecord } from "../../../../utils/components/tira-lista/TiraListaConfig";

@Component({
    templateUrl: "./objetos-listagem.component.html",
    styleUrl: "./objetos-listagem.component.scss",
    imports: [
    CommonModule, ObjetosFiltroComponent, FontAwesomeModule,
    ReactiveFormsModule, BarraPaginacaoComponent,
    RouterModule, ObjetosOrdenacaoComponent, TiraListaComponent,
    ProgressModalComponent,
    CampoPesquisaComponent
]
})
export class ObjetosListagemComponent implements AfterViewInit{

    searchIcon = faMagnifyingGlass;
    novoObjIcon = faFileLines;
    
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;
    @ViewChild(ObjetosFiltroComponent) filtroComponent : ObjetosFiltroComponent;
    @ViewChild(ObjetosOrdenacaoComponent) ordenacaoComponent : ObjetosOrdenacaoComponent;

    qtObjetos = 0;

    filtro : IObjetoFiltro = {};
    ordem : IOrdemItem[];

    objetosLista : TiraRecord<ObjetoTiraDTO>[];

    txtBusca = new FormControl("");

    pode : IPodeDTO
    
    larguraPaginacao = 7;
    qtPorPagina = 15;

    paginaAtual = 1;

    lock = true;

    showProgress = false;

    constructor(
        private objService : ObjetosService,
        private router : Router,
        private route : ActivatedRoute,
        private toastr : ToastrService,
        private permissaoService : PermissaoService
    ){}


    ngAfterViewInit(): void {   
        

        combineLatest([
            this.filtroComponent.filterChange,
            this.ordenacaoComponent.onChange
        ]).pipe(take(1)).subscribe(([filtro, ordem]) => {
            this.txtBusca.valueChanges.pipe(tap(value => {
                this.executar(this.recarregarLista(this.paginaAtual)) 
            })).subscribe();
            this.executar(this.recarregarLista(this.paginaAtual, filtro, ordem).pipe(finalize(() => this.lock = false)))

        })

        this.permissaoService.getPermissao("carteiraobjetos").subscribe(pode => {
            this.pode = pode;
        });
    }

    updateFiltro(novoFiltro : IObjetoFiltro) {
        this.filtro = novoFiltro;

        if(!this.lock)
           this.executar(this.recarregarLista(this.paginaAtual, novoFiltro));
    }

    redirectTo(path : string) {
        if(!this.pode.visualizar) return;

        this.router.navigate([path], {relativeTo: this.route})
    }

    removerObjeto(objeto : ObjetoTiraDTO) {
        this.objService.removerObjeto(objeto.id).pipe(
            tap(obj => {
                this.toastr.success("Objeto Removido!");
                this.executar(this.recarregarLista(this.paginaAtual));
            })
        ).subscribe()
    }

    setOrdem(novaOrdem : IOrdemItem[]) {
        this.ordem = novaOrdem;

        if(!this.lock)
            this.executar(this.recarregarLista(this.paginaAtual, this.filtro, novaOrdem));
    }

    executar(acao : Observable<any>) {
        this.showProgress = true;

        acao.pipe(finalize(() => this.showProgress = false)).subscribe()
    }

    clickFunc = (item: TiraRecord<ObjetoTiraDTO>) => {
        if(!this.pode.visualizar) return;

        this.redirectTo(item.dado.id.toString());
    }

    recarregarLista(novaPagina : number, novoFiltro? : IObjetoFiltro,  novaOrdem? : IOrdemItem[]) {

        this.paginaAtual = novaPagina;
        
        this.filtro.nome = this.txtBusca.value;

        if(novaOrdem)
            this.ordem = novaOrdem;

        if(novoFiltro)
            this.filtro = novoFiltro;

        
        return merge(
            this.objService.getListaTiraObjetos(this.filtro, this.ordem, this.paginaAtual, this.qtPorPagina).pipe(tap(
                ({data, ammount}) => {

                    let config = [
                            new TiraListaCol({ titulo: "Objeto", caminhoValor: 'nome', tipo: 'propLongo', largura: '5fr' }),
                            new TiraListaCol({ titulo: "Tipo", caminhoValor: 'tipo' }),
                            new TiraListaCol({ titulo: "Unidade", caminhoValor: 'unidadeResponsavel' }),
                            new TiraListaCol({ titulo: "Código P.O.", caminhoValor: 'codPO', valorDefault: 'Sem P.O' }),
                            new TiraListaCol({ titulo: "Previsto", caminhoValor: 'totalPrevisto', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Contratado", caminhoValor: 'totalContratado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Autorizado", caminhoValor: 'totalAutorizado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Empenhado", caminhoValor: 'totalEmpenhado', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Disp. S/ Reserva", caminhoValor: 'totalDisponivel', tipo: "propDinheiro" }),
                            new TiraListaCol({ titulo: "Status", caminhoValor: 'status'})
                        ]
                    if(this.pode.excluir)
                        config.push(
                            new TiraListaCol<ObjetoTiraDTO>({ tipo: 'acao', opcoes: [
                                {
                                    label: 'Remover',
                                    icon: faTrash,
                                    tipo: 'negativo',
                                    acao: (evt, data) => this.removerObjeto(data)
                                }
                            ] })
                        )

                    this.objetosLista = data.map(obj => new TiraRecord<ObjetoTiraDTO> ({
                        dado: obj,
                        config: config
                    }));
                    this.qtObjetos = ammount;
                    this.barraPaginacaoComponent.updatePaginacao(ammount);
                }
            ))
        );
    }


}