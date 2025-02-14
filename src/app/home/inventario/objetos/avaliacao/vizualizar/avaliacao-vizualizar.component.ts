import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, QueryList, ViewChildren } from "@angular/core";
import { IObjeto } from "../../../../../utils/interfaces/IObjeto";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { concat, finalize, merge, tap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ObjetosService } from "../../../../../utils/services/objetos.service";
import { DataUtilService } from "../../../../../utils/services/data-util.service";
import { IFluxo } from "../../../../../utils/interfaces/fluxo.interface";
import { IEtapa } from "../../../../../utils/interfaces/etapa.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight, faFileContract, faHandPointDown, faPlusCircle, faThumbsDown, faThumbsUp, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FluxosService } from "../../../../../utils/services/fluxos.service";
import { MultSelectDropDownComponent } from "../../../../../utils/components/multSelectDropDown/multSelect-dropdown.component";
import MultiSelectDropdownItemComponent from "../../../../../utils/components/multSelectDropDown/multSelect-dropdown-item/multSelect-dropdown-item.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { OpcaoItemComponent } from "../../../../../utils/components/dropdown-com-filtro/opcao-item.component";
import { IAreaTematica } from "../../../../../utils/interfaces/IAreaTematica";
import { ITipoPlano } from "../../../../../utils/interfaces/ITipoPlano";
import { LocalidadeDTO } from "../../../../../utils/models/LocalidadeDTO";
import { PlanoOrcamentarioDTO } from "../../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../../utils/models/UnidadeOrcamentariaDTO";
import { ICusto } from "./exercicio-cadastro.interface";
import { UnidadeOrcamentariaService } from "../../../../../utils/services/unidadeOrcamentaria.service";
import { AreaTematicaService } from "../../../../../utils/services/areaTematica.service";
import { LocalidadeService } from "../../../../../utils/services/localidade.service";
import { PlanoOrcamentarioService } from "../../../../../utils/services/planoOrcamentario.service";
import { TipoPlanoService } from "../../../../../utils/services/tipoPlano.service";
import { DropdownFiltroComponent } from "../../../../../utils/components/dropdown-com-filtro/dropdown-com-filtro.component";
import { AvaliacaoExercicioComponent } from "./avaliacao-exercicio/avaliacao-exercicio.component";
import { ProfileService } from "../../../../../utils/services/profile.service";
import { GrupoService } from "../../../../../utils/services/grupo.service";
import { IAcao } from "../../../../../utils/interfaces/acao.interface";
import { IExecutarAcao } from "../../../../../utils/interfaces/executar-acao.interface";
import { AcaoService } from "../../../../../utils/services/acao.service";
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { ISelectOpcao } from "../../../../../utils/interfaces/selectOption.interface";
import { ApontamentoModalComponent } from "./apontamento-modal/apontamento-modal.component";
import { apontamentoPadrao, IApontamento } from "../../../../../utils/interfaces/apontamento.interface";
import { VizualizarApontamentoModalComponent } from "./vizualizar-apontamentos-modal/vizualizar-apontamentos-modal.component";
import { AcaoEvent, ParecerModalComponent } from "./parecer-modal/parecer-modal.component";
import { IParecer, parecerPadrao } from "../../../../../utils/interfaces/parecer.interface";
import { EtapaEnum } from "../../../../../utils/enum/etapa.enum";
import { VisualizarParecerComponent } from "./visualizar-parecer/visualizar-parecer.component";
import { PermissaoService } from "../../../../../utils/services/permissao.service";

@Component({
    standalone: true,
    templateUrl: "./avaliacao-vizualizar.component.html",
    styleUrl: "./avaliacao-vizualizar.component.scss",
    imports: [CommonModule, FontAwesomeModule, AvaliacaoExercicioComponent,
    MultSelectDropDownComponent, MultiSelectDropdownItemComponent, NgSelectComponent,
    ReactiveFormsModule, FormsModule, OpcaoItemComponent, DropdownFiltroComponent,
    NgLabelTemplateDirective, NgOptionTemplateDirective, ApontamentoModalComponent, VizualizarApontamentoModalComponent, ParecerModalComponent, VisualizarParecerComponent]
})
export class AvaliacaoVizualizarComponent implements AfterViewInit {

    @ViewChildren(AvaliacaoExercicioComponent) cadastroExercicios : QueryList<AvaliacaoExercicioComponent>;

    objeto : IObjeto = {
        tipoConta: "Investimento",
        tipo: "Projeto",
        recursosFinanceiros: [],
        conta: {}
    }

    userId : string;

    EtapaEnum = EtapaEnum;

    setaDireita = faChevronRight;

    parecer : IParecer = {
        ...parecerPadrao
    };

    feedback : IApontamento[] | IParecer;

    feedbackAsIApontamento() : IApontamento[] {
        return this.feedback as IApontamento[];
    }
    
    feedbackAsParecer() : IParecer {
        return this.feedback as IParecer;
    }
    
    addIcon = faPlusCircle;
    limparIcon = faXmarkCircle;
    positivoIcon = faThumbsUp;
    negativoIcon = faThumbsDown;
    apontamentoIcon = faHandPointDown;
    parecerIcon = faFileContract;

    fluxo : IFluxo;
    
    checado = false;

    executaAcao = false;

    exibirModal = false;
    exibirFeedback = false;
    exibirFazerParecer = false;
    exibirVerParecer = false;

    exibeTodasUnidades = false;

    unidades : UnidadeOrcamentariaDTO[];
    opcoesUnidades : ISelectOpcao<UnidadeOrcamentariaDTO>[]
    planosOrcamentario : PlanoOrcamentarioDTO[];
    opcoesPlanosOrcamentarios : ISelectOpcao<PlanoOrcamentarioDTO>[];
    opcoesTipoPlano : ISelectOpcao<ITipoPlano>[];
    microregioes : LocalidadeDTO[];
    tiposplano : ITipoPlano[];
    areasTematicas : IAreaTematica[];

    acoesPositivas : IAcao[] = [];
    acoesNegativas : IAcao[] = [];

    objetoCadastro = new FormGroup({
        tipoConta: new FormControl(null, Validators.required),
        tipo: new FormControl(null, Validators.required),
        nome: new FormControl(null, Validators.required),
        descricao: new FormControl(null, Validators.required),
        unidade: new FormControl(undefined, Validators.required),
        planoOrcamentario: new FormControl(undefined),
        microregiaoAtendida: new FormControl(undefined, Validators.required),
        infoComplementares: new FormControl(null),
        planos : new FormControl([], Validators.required),
        contrato : new FormControl(null),
        areaTematica : new FormControl(null),
        inPossuiOrcamento : new FormControl(undefined, Validators.required)

    });

    etapasStatus : {
        etapa: IEtapa,
        status: number,
        pos: number
    }[] = [];

    linhas : {
        status: number,
        posInicial: number,
        posFinal: number
    }[] = [];

    acaoDoModal : IAcao;


    constructor(
        private route : ActivatedRoute,
        private toastr : ToastrService,
        private router : Router,
        private objetoService : ObjetosService,
        private dataUtil : DataUtilService,
        private fluxoService : FluxosService,
        private usuarioService : ProfileService,
        private grupoService : GrupoService,
        private unidadeService : UnidadeOrcamentariaService,
        private planoService : PlanoOrcamentarioService,
        private localidadeService : LocalidadeService,
        private tipoPlanoService : TipoPlanoService,
        private areaTematicaService : AreaTematicaService,
        private acaoService : AcaoService,
        private permissaoService : PermissaoService
    ){
        
    }

    fecharFazerParecer(acaoEvent : AcaoEvent) {

        if(acaoEvent.acao) {
            this.salvarFeedBack(null);
        } else {
            this.exibirFazerParecer = false;
        }

        

    }

    fecharModal(){
        this.exibirModal = false;
    }

    removerApontamento(apontamentoRemovido: IApontamento) {
        this.objeto.apontamentos = this.objeto.apontamentos.filter(a => a !== apontamentoRemovido);
    }

    salvarFeedBack(novosApontamentos : IApontamento[]){
        if(!this.checarEtapaEnum(EtapaEnum.SOLICITACAO_CADASTRO)) {
            // if((this.checarEtapaEnum(EtapaEnum.APROVACAO_SUBEO) && !this.validarParecer())
               if((!this.checarEtapaEnum(EtapaEnum.APROVACAO_SUBEO) &&  !this.validarApontamentos()))
                return;
        }

        let objetoFinal : IObjeto = this.gerarObjetoFinal()
        
        let executarAcaoDto : IExecutarAcao;
        // if(this.checarEtapaEnum(EtapaEnum.APROVACAO_SUBEO)){
        //     executarAcaoDto = {
        //         acao: this.acaoDoModal,
        //         parecer: this.parecer,
        //         objeto: objetoFinal
        //     }
        // } else {
            executarAcaoDto = {
                acao: this.acaoDoModal,
                apontamentos: novosApontamentos,
                objeto: objetoFinal
            }
        // }
        
        
        this.acaoService.executarAcao(executarAcaoDto).pipe(
            tap(objeto => {
                this.toastr.success("Acão de " + this.acaoDoModal.nome + " executada com sucesso");
                                
                this.parecer = { ...parecerPadrao}
                this.setObjeto(objeto);
                

                this.exibirFazerParecer = false;
                this.exibirModal = false;
                
            })
        ).subscribe();
        

    }

    validarApontamentos() : boolean {

        let valido = true;

        this.objeto.apontamentos.forEach(apontamento => {
            let preenchido = apontamento.campo
                          && apontamento.texto 
                          && apontamento.texto !== '';

            if(!preenchido) {
                this.toastr.error("Favor preencher todos os apontamentos ou remover os que não for utilizar");
                valido = false;
            }
        })

        return valido;
    }

    validarParecer() : boolean {
        let valido = this.parecer && this.parecer.texto.trim() !== "";

        if(!valido) {
            this.toastr.error("Favor preencher o parecer antes de devolver")
        }

        return valido;
    }

    setFluxo(fluxo: IFluxo) {
        this.fluxo = fluxo;
    }

    checarEtapaEnum(etapaEnum : EtapaEnum){
        return (<any>EtapaEnum)[this.objeto.emEtapa?.etapa.etapaId] === etapaEnum;
    }

    setObjeto(objeto : IObjeto) {
        this.objeto = objeto;

        
        this.dataUtil.setTitleInfo("objetoId", this.objeto.nome);
    
        this.objetoCadastro.controls.microregiaoAtendida.setValue(
            this.objeto.microregiaoAtendida ? 
            this.microregioes.find(value => value.id == this.objeto.microregiaoAtendida.id)
            : null
        );
        
        this.objetoCadastro.controls.planos.setValue(
            this.tiposplano.filter(tipoItem => objeto.planos.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id))
        );

        this.objetoCadastro.controls.areaTematica.setValue(
            this.areasTematicas.find(area => objeto.areaTematica?.id == area.id)
        );

        this.usuarioService.getUser().pipe(
            tap(user => {
                this.userId = user.id;
                this.grupoService.findByUsuario(user.id).pipe(
                    tap(grupos => {
                        this.executaAcao = grupos.map(g => g.id).includes(objeto.emEtapa.etapa.grupoResponsavel.id)
                                           || Boolean(user.role.find(funcao => funcao.nome === "GESTOR_MASTER"));
                    })
                ).subscribe()
            })
        ).subscribe()

        this.acaoDoModal = objeto.emEtapa.etapa.acoes.find(acao => acao.positivo !== undefined && !acao.positivo);
        this.recarregarFluxo();
        this.feedback = this.objeto.apontamentos
        // this.feedback = this.checarEtapaEnum(EtapaEnum.ANALISE_TECNICA) ?
        //      this.objeto.pareceres?.sort((p1, p2) => {
        //         let d1 = new Date(p1.timestamp);
        //         let d2 = new Date(p2.timestamp);

        //         return d2.getTime() - d1.getTime();
        //      })[0] :
        
        //     this.objeto.apontamentos?.filter(apontamento => {
        //         return apontamento.etapa.id === this.objeto.emEtapa.etapa.id;
        //     })
        
        this.acoesNegativas = this.objeto.emEtapa.etapa.acoes.filter(a => a.positivo !== undefined && !a.positivo);
        this.acoesPositivas = this.objeto.emEtapa.etapa.acoes.filter(a => a.positivo !== undefined && a.positivo);


    }

    getEtapaAnterior() : IEtapa {
        let nOrdem = this.objeto.emEtapa.etapa.ordem;
        
        if (nOrdem === 0)
            return undefined;

        return this.fluxo.etapas.find(e => e.ordem === nOrdem - 1)
    }

    doExibirFeedBack(){
        // if(this.checarEtapaEnum(EtapaEnum.ANALISE_TECNICA)) {
        //     this.exibirVerParecer = true;
        // } else {
            this.exibirFeedback = true;
        // }
    }

    recarregarFluxo(){
        if(!this.fluxo)
            return;


        let status = 0;
        let posStep = 1300/(this.fluxo.etapas.length - 1);

        let posInicial = -20;
        this.fluxo.etapas.forEach((etapa, i) => {
            let pos = (i * posStep) + 50;
            if(etapa.id == this.objeto.emEtapa.etapa.id){
                this.etapasStatus.push({
                    etapa: etapa,
                    status: 1,
                    pos: pos
                })
                this.linhas.push({
                    status: 1,
                    posInicial: posInicial,
                    posFinal: pos
                })
                posInicial = pos
                status = 2
            } else {
                
                let acaoPositivo = this.objeto.emEtapa.etapa.acoes.find(acao => acao.positivo);

                let statusFinal = (acaoPositivo.proxEtapaId === etapa.id)
                                && this.objeto.emEtapa.devolvido ? -1 : status

                this.etapasStatus.push({
                    etapa: etapa,
                    status: statusFinal,
                    pos: pos

                })

                this.linhas.push({
                    status: statusFinal,
                    posInicial: posInicial,
                    posFinal: pos
                })
                posInicial = pos
            }

            
        })
        this.linhas.push({
            status: status,
            posInicial: posInicial,
            posFinal: 1420
        })
    }

    gerarPath(pos: number, status : number) : string{
        switch(status) {
            case 0: 
                return "M " + (pos - 6) + " 50 L " + (pos-1) + " 55 L " + (pos + 6) + " 45";
            
            default: 
                return "M " + (pos) + " 42 L " + (pos) + " 53 M " + (pos) + " 56 L " + (pos) + " 60";

        }
        
    }

    

    setAreasTematicas (areaList : IAreaTematica[]) {
        this.areasTematicas = areaList;
        this.objetoCadastro.controls.areaTematica.setValue(
            this.areasTematicas.find(area => this.objeto.areaTematica?.id == area.id)
        );
    }

    setPlanos (planoList : PlanoOrcamentarioDTO[]) {
        this.opcoesPlanosOrcamentarios = planoList.map(
            plano => { return {
                label: plano.codigo + ' - ' + plano.nome,
                value: plano
            }}
        )   

        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.objeto.conta.planoOrcamentario = this.opcoesPlanosOrcamentarios.find(opt => this.selecionarPlanoOrcamentario(opt, this.objeto.conta.planoOrcamentario) )?.value
        
    }

    selecionarUnidade(option : ISelectOpcao<UnidadeOrcamentariaDTO>, model : UnidadeOrcamentariaDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    selecionarPlanoOrcamentario(option : ISelectOpcao<PlanoOrcamentarioDTO>, model : PlanoOrcamentarioDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    selecionarTiposPlanos(option : ISelectOpcao<ITipoPlano>, model : ITipoPlano) : boolean {
        return option.value?.id === model?.id
    }

    setUnidades(unidadeList : UnidadeOrcamentariaDTO[]){
        
        this.opcoesUnidades = unidadeList.map(unidade => {
            return {
                label: unidade.codigo + ' - ' + unidade.sigla,
                value: unidade
            }
        })

        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.objeto.conta.unidadeOrcamentariaImplementadora = this.opcoesUnidades.find(opt => this.selecionarUnidade(opt, this.objeto.conta.unidadeOrcamentariaImplementadora) )?.value
    }

    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }

    setTiposPlano(tipoPlanoList : ITipoPlano[]) {
        this.tiposplano = tipoPlanoList;

        this.objetoCadastro.controls.planos.setValue(
            this.tiposplano.filter(tipoItem => this.objeto.planos?.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id))
        );

        
        this.opcoesTipoPlano = tipoPlanoList.map(
            tpPlano => { return {
                    label: `${tpPlano.nome} - ${tpPlano.sigla}`,
                    value: tpPlano
                }

            }
        )
    }

    setMicrorregioes(localidadeList : LocalidadeDTO[]){
        this.microregioes = localidadeList;
        this.objetoCadastro.controls.microregiaoAtendida.setValue(
            this.objeto.microregiaoAtendida ? 
            this.microregioes.find(value => value.id == this.objeto.microregiaoAtendida?.id)
            : null
        );
    }

    ngAfterViewInit(): void {
        this.objetoCadastro.controls.tipoConta.disable({onlySelf: true});
        this.objetoCadastro.controls.tipo.disable({onlySelf: true});

        merge(            
            this.unidadeService.getFromSigefes().pipe(
                tap(unidadeList => this.setUnidades(unidadeList))
            ),
            this.localidadeService.findAll().pipe(
                tap(localidadeList => this.setMicrorregioes(localidadeList))
            ),
            this.tipoPlanoService.findAll().pipe(
                tap(tipoPlanoList => this.setTiposPlano(tipoPlanoList))
            ),
            this.areaTematicaService.findAllAreaTematica().pipe(
                tap(areasTematicas => this.setAreasTematicas(areasTematicas))
            ),
            this.planoService.getDoSigefes(null).pipe(
                tap(planoList => this.setPlanos(planoList))
            ),
            this.permissaoService.getPermissao('inventarioobjetos').pipe(
                tap(permissao => {
                    this.exibeTodasUnidades = !!permissao?.verTodasUnidades;
                })
            )
        ).pipe(finalize(() => {
            this.route.params.pipe(
                tap(params => {
                    let objetoId = params["objetoId"];
                    
                    if(!objetoId) {
                        this.toastr.error("Id do objeto inexistente");
                        this.router.navigate([".."], {relativeTo: this.route});
                    }
    
                    concat(
                        
                        this.objetoService.getById(objetoId).pipe(
                            tap(objeto => {
                                
                                this.fluxoService.findWithEtapa(objeto.emEtapa.etapa.id).pipe(
                                    tap(fluxo => this.setFluxo(fluxo)),
                                    finalize(() => this.setObjeto(objeto))
                                ).subscribe()
                                    
                                this.usuarioService.getUser().pipe(
                                    tap(user => {
                                        if(!this.exibeTodasUnidades){
                                            this.objetoCadastro.controls.unidade.disable({onlySelf: true});
                                        }

                                        this.grupoService.findByUsuario(user.id).pipe(
                                            tap(grupos => {
                                                this.executaAcao = grupos.map(g => g.id).includes(objeto.emEtapa.etapa.grupoResponsavel.id)
                                                                   || Boolean(user.role.find(funcao => funcao.nome === "GESTOR_MASTER"));
                                                this.objetoCadastro.disable;
                                            })
                                        ).subscribe()
                                    })
                                ).subscribe()
    
                            })
                        )
                    ).subscribe()
                    
    
                })
            ).subscribe()
        })).subscribe();

        

    }


    executarAcao(acao : IAcao){

        let exercValidos = true;

        this.cadastroExercicios.forEach(
            exercicio => {
                if(!exercicio.validar())
                     exercValidos = false
            }
        )

        if(acao.positivo && (!exercValidos || !this.validarForm())) {
            this.toastr.error("Favor preeencher os campos obrigatórios");
        } else {
            let objetoFinal : IObjeto = this.gerarObjetoFinal()

            let executarAcaoDto : IExecutarAcao = {
                acao: acao,
                apontamentos: [],
                objeto: objetoFinal
            }
            
            if(acao.positivo){
                this.acaoService.executarAcao(executarAcaoDto).pipe(
                    tap(objeto => {
                        this.toastr.success("Acão de " + acao.nome + " executada com sucesso");
                        if(!objeto.emEtapa){
                            this.router.navigate([".."], {relativeTo: this.route});
                        }
                        this.setObjeto(objeto);
                    })
                ).subscribe();
            } else {
                // if(this.checarEtapaEnum(EtapaEnum.APROVACAO_SUBEO)){
                    // this.exibirFazerParecer = true;
                // } else {
                    
                // }
                if(acao.proxEtapaId){
                    this.exibirModal = true;
                } else {
                    let resp = confirm("Se você remover o objeto ele será excluido definitivamente.\n Tem certeza que deseja excluir?");
                    if(resp){
                        this.acaoService.executarAcao(executarAcaoDto).pipe(
                            tap(objeto => {
                                this.toastr.success("Objeto excluido com sucesso");
                                this.router.navigate([".."], {relativeTo: this.route});
                                
                            })
                        ).subscribe();
                    }
                }

                
                
            }
            
        }

        this.checado = true;
        
    }

    validarForm() : boolean {

        let valido = !!this.objeto.tipo
                && !!this.objeto.tipoConta 
                && !!this.objeto.nome 
                && !!this.objeto.descricao 
                && !!this.objeto.conta.unidadeOrcamentariaImplementadora
                && !!this.objeto.microregiaoAtendida
                && !!this.objeto.infoComplementares;

        if(this.checarEtapaEnum(EtapaEnum.CADASTRO_PO)) {
            valido = valido 
                && !!this.objeto.conta.planoOrcamentario
        }

        return valido;
    }

    gerarObjetoFinal() : IObjeto {
        // return {
        //     id: this.objeto.id,
        //     ...this.objetoCadastro.getRawValue(),
        //     emEtapa: this.objeto.emEtapa,
        //     emStatus: this.objeto.emStatus,
        //     apontamentos: this.objeto.apontamentos,
        //     pareceres: this.objeto.pareceres,
        //     conta: {
        //         planoOrcamentario: this.objetoCadastro.value.planoOrcamentario,
        //         unidadeOrcamentariaImplementadora: this.objetoCadastro.value.unidade
        //     },
        //     recursosFinanceiros: this.objeto.recursosFinanceiros
        // };

        return this.objeto;
    }
    
    removerExercicio(exerc : ICusto) {
        this.objeto.recursosFinanceiros = this.objeto.recursosFinanceiros.filter(exercicio => exercicio !== exerc );
    }

    addExercicio() {
        this.objeto.recursosFinanceiros.push({
            anoExercicio: this.objeto.recursosFinanceiros.length > 0 ? this.objeto.recursosFinanceiros[this.objeto.recursosFinanceiros.length-1].anoExercicio + 1 : new Date().getFullYear(),
            indicadaPor: [{fonteOrcamentaria: null}]
        })
    }


}

