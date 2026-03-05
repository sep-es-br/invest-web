import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AudienciaPublicaService } from "../../../../utils/services/audiencia-publica.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { tap, finalize, merge, Observable, switchMap } from "rxjs";
import { InfosService } from "../../../../utils/services/infos.service";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { StatusService } from "../../../../utils/services/status.service";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowRight, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { AreaTematicaService } from "../../../../utils/services/areaTematica.service";
import { IAreaTematica } from "../../../../utils/interfaces/IAreaTematica";
import { cleanApoc } from "../../../../utils/funcoes-util";
import { IProposta } from "../../../../utils/interfaces/proposta.interface";
import { CampoPesquisaComponent } from "../../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { Router } from "@angular/router";
import { PROPOSTA_ATIVA } from "../../../../utils/sessionLocalItems.const";
import { BarraPaginacaoComponent } from "../../../../utils/components/barra-paginacao/barra-paginacao.component";
import { IPodeDTO } from "../../../../utils/models/PodeDto";
import { TiraListaComponent } from "../../../../utils/components/tira-lista/tira-lista.component";
import { TiraListaCol, TiraRecord } from "../../../../utils/components/tira-lista/TiraListaConfig";

@Component({
    templateUrl: './audiencia-publica-listagem.component.html',
    styleUrl: './audiencia-publica-listagem.component.scss',
    imports: [
        CommonModule, NgSelectModule, FormsModule, TiraListaComponent,
        FontAwesomeModule, 
        CampoPesquisaComponent, BarraPaginacaoComponent]
})
export class AudienciaPublicaListagemComponent implements OnInit{

    
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    removerIcon = faXmarkCircle;
    criarIcon = faArrowRight;
    unidades : UnidadeOrcamentariaDTO[];
    areasTematicas : IAreaTematica[];
    permissao : IPodeDTO = undefined;
    filtro : {
        unidades?: UnidadeOrcamentariaDTO[];
        areaTematica?: IAreaTematica,
        filtroTexto?: string
    } = {
        filtroTexto: ''
    };

    qtPropostas = 0;
    listaPropostas : IProposta[] = [];
    propostaLista: TiraRecord<IProposta>[] = [];
    paginaAtual: number = 1;

    carregando = false;

    
    constructor(
        private apSrv : AudienciaPublicaService,
        private unidadeService: UnidadeOrcamentariaService,
        private areaTematicaSrv: AreaTematicaService,
        private permissaoService : PermissaoService,
        private router: Router
    ){}
    

    ngOnInit(): void {
        
        this.carregando = true;
        this.permissaoService.getPermissao("carteiraaudiencia-publica").pipe(
        switchMap(permissao => {
            this.permissao = permissao;

            let consulta: Observable<any>[] = [
                this.areaTematicaSrv.findAllAreaTematica().pipe(
                    tap(value => this.areasTematicas = value)
                )
            ];

            const unidade$ = permissao.verTodasUnidades
            ? this.unidadeService.getFromSigefes().pipe(
                tap(unidadeList => this.unidades = unidadeList)
                )
            : this.unidadeService.getUnidadeDoUsuario().pipe(
                tap(unidades => {
                    this.unidades = unidades;
                    if (unidades?.length === 1) {
                    this.filtro.unidades = unidades;
                    }
                })
                );

            consulta.push(unidade$);

            return merge(...consulta);
        }),
        finalize(() => this.update(this.paginaAtual))
        ).subscribe();
    }

    update(novaPag: number, txtSearch?:string) {
        this.carregando = true;
        this.paginaAtual = novaPag;
        if(this.permissao == undefined) return;
        
        this.apSrv.getListagem(
            this.filtro.unidades, 
            this.filtro.areaTematica, 
            txtSearch ?? this.filtro.filtroTexto, 
            this.permissao.verTodasUnidades,
            novaPag
        ).pipe(
            tap(({data, ammount}) => {
                this.listaPropostas = data;
                this.propostaLista = data
                    .map(prop => ({...prop, label: `(${prop.budgetUnitId}) ${prop.budgetUnitName}`}))
                    .map(proposta => new TiraRecord<IProposta>({
                        dado: proposta,
                        config: [
                            new TiraListaCol<IProposta>({
                                titulo: 'Proposta',
                                caminhoValor: 'proposalText',
                                tipo: 'propLongo',
                                largura: '5fr'
                            }), 
                            new TiraListaCol<IProposta>({   
                                titulo: 'Área Temática',
                                caminhoValor: 'areaName',
                                largura: '2fr'
                            }),
                            new TiraListaCol<IProposta>({
                                titulo: 'Unidade Orçamentária',
                                caminhoValor: 'label',
                                tipo: 'propLongo'
                            }),
                            new TiraListaCol<IProposta>({
                                titulo: 'Microrregião',
                                caminhoValor: 'microrregion'
                            }),
                            new TiraListaCol<IProposta>({
                                tipo: 'botao',
                                opcoes: [
                                    {
                                        label: 'Criar Objeto',
                                        icon: faArrowRight,
                                        acao: (evt, data) => {
                                            this.criarObjeto(data)
                                        },
                                    }
                                ] 
                            })

                        ]
                    }))
                this.qtPropostas = ammount;
                this.barraPaginacaoComponent.updatePaginacao(ammount);
            }),
            finalize(() => this.carregando = false)
        ).subscribe();
    }

    removerSelecao(arr : any[], item: any) : any[] {
        arr = arr.filter(a => a !== item)
        return arr;
    }

    searchUnidade(term : string, item : UnidadeOrcamentariaDTO) {
        return cleanApoc(item.sigla).includes(cleanApoc(term))
                || item.codigo.includes(term);
    }

    searchArea(term : string, item : IAreaTematica) {
        return cleanApoc(item.nome).includes(cleanApoc(term));
    }

    criarObjeto(proposta : IProposta) {
        sessionStorage.setItem(PROPOSTA_ATIVA, JSON.stringify(proposta));
        this.router.navigateByUrl('/home/carteira/objetos/novo');
    }

}