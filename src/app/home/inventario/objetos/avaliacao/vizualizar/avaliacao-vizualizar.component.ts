import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, QueryList, ViewChildren } from "@angular/core";
import { IObjeto } from "../../../../../utils/interfaces/IObjeto";
import { ActivatedRoute, Router } from "@angular/router";
import { concat, finalize, merge, tap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ObjetosService } from "../../../../../utils/services/objetos.service";
import { DataUtilService } from "../../../../../utils/services/data-util.service";
import { IFluxo } from "../../../../../utils/interfaces/fluxo.interface";
import { IEtapa } from "../../../../../utils/interfaces/etapa.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight, faFileContract, faHandPointDown, faPlusCircle, faThumbsDown, faThumbsUp, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FluxosService } from "../../../../../utils/services/fluxos.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IAreaTematica } from "../../../../../utils/interfaces/IAreaTematica";
import { ITipoPlano } from "../../../../../utils/interfaces/ITipoPlano";
import { LocalidadeDTO } from "../../../../../utils/models/LocalidadeDTO";
import { PlanoOrcamentarioDTO } from "../../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../../utils/models/UnidadeOrcamentariaDTO";
import { ICusto } from "./exercicio-cadastro.interface";
import { ICusto as Custo } from "../../../../../utils/interfaces/objetoDetail.interface";
import { UnidadeOrcamentariaService } from "../../../../../utils/services/unidadeOrcamentaria.service";
import { AreaTematicaService } from "../../../../../utils/services/areaTematica.service";
import { LocalidadeService } from "../../../../../utils/services/localidade.service";
import { PlanoOrcamentarioService } from "../../../../../utils/services/planoOrcamentario.service";
import { TipoPlanoService } from "../../../../../utils/services/tipoPlano.service";
import { AvaliacaoExercicioComponent } from "./avaliacao-exercicio/avaliacao-exercicio.component";
import { ProfileService } from "../../../../../utils/services/profile.service";
import { GrupoService } from "../../../../../utils/services/grupo.service";
import { IAcao } from "../../../../../utils/interfaces/acao.interface";
import { IExecutarAcao } from "../../../../../utils/interfaces/executar-acao.interface";
import { AcaoService } from "../../../../../utils/services/acao.service";
import { NgSelectComponent } from '@ng-select/ng-select';
import { ISelectOpcao } from "../../../../../utils/interfaces/selectOption.interface";
import { ApontamentoModalComponent } from "./apontamento-modal/apontamento-modal.component";
import { IApontamento } from "../../../../../utils/interfaces/apontamento.interface";
import { VizualizarApontamentoModalComponent } from "./vizualizar-apontamentos-modal/vizualizar-apontamentos-modal.component";
import { AcaoEvent } from "./parecer-modal/parecer-modal.component";
import { IParecer, parecerPadrao } from "../../../../../utils/interfaces/parecer.interface";
import { EtapaEnum } from "../../../../../utils/enum/etapa.enum";
import { PermissaoService } from "../../../../../utils/services/permissao.service";
import { ProgressModalComponent } from "../../../../../utils/components/progress-modal/progress-modal.component";
import { IObjetoDetail } from "../../../../../utils/interfaces/objetoDetail.interface";
import { ApontamentoService } from "../../../../../utils/services/apontamento.service";
import { FonteOrcamentariaService } from "../../../../../utils/services/fonteOrcamentaria.service";
import { IVinculadaPor } from "../../../../../utils/interfaces/IVinculadaPor";
import { IFonteExercicio } from "./fonte-exercicio.interface";
import { IObjetoCadastroForm, ICusto as CadastroCusto, IValoresFonte as CadastroValoresFonte } from "../../../../../utils/interfaces/objeto-cadastro-form.interface";
import { StatusEnum } from "../../../../../utils/enum/status.enum";

@Component({
    templateUrl: "./avaliacao-vizualizar.component.html",
    styleUrl: "./avaliacao-vizualizar.component.scss",
    imports: [
    CommonModule, FontAwesomeModule, AvaliacaoExercicioComponent,
    NgSelectComponent, ReactiveFormsModule, FormsModule,
    ApontamentoModalComponent, VizualizarApontamentoModalComponent,
    ProgressModalComponent
]
})
export class AvaliacaoVizualizarComponent implements AfterViewInit {

    @ViewChildren(AvaliacaoExercicioComponent) cadastroExercicios : QueryList<AvaliacaoExercicioComponent>;

    objeto : IObjetoDetail = {
        tipoInvestimento: "Investimento",
        tipoObjeto: "Projeto",
    } as IObjetoDetail;
    apontamentos : IApontamento[];
    microregiao : LocalidadeDTO;
    areaTematica : IAreaTematica;
    planoOrcamentario : PlanoOrcamentarioDTO;
    unidadeOrcamentaria : UnidadeOrcamentariaDTO;
    recursosFinanceiros : ICusto[] = [];

    userId : number;

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

    gnd : number = 4;
    
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

    carregamento = 0;

    isGestorMaster = false;

    etapasStatus : {
        etapa: IEtapa,
        status: number,
        pos: number,
        timestamp: string
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
        private permissaoService : PermissaoService,
        private apontamentoSrv : ApontamentoService,
        private fonteSrv : FonteOrcamentariaService
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
        this.apontamentos = this.apontamentos.filter(a => a !== apontamentoRemovido);
    }

    salvarFeedBack(novosApontamentos : IApontamento[]){
        if(this.acaoDebounce) return;

        this.acaoDebounce = true;
        
        if(!this.checarEtapaEnum(EtapaEnum.SOLICITACAO_CADASTRO)) {
            // if((this.checarEtapaEnum(EtapaEnum.APROVACAO_SUBEO) && !this.validarParecer())
               if((!this.checarEtapaEnum(EtapaEnum.APROVACAO_SUBEO) &&  !this.validarApontamentos())){
                    this.acaoDebounce = false;
                    return;
               }
        }

        let objetoFinal : IObjetoCadastroForm = this.gerarObjetoFinal()
        
        let executarAcaoDto : IExecutarAcao;
     
        executarAcaoDto = {
            acao: this.acaoDoModal,
            apontamentos: novosApontamentos,
            objeto: objetoFinal
        }
        
        this.carregamento++;
        
        this.exibirFazerParecer = false;
        this.exibirModal = false;
        this.acaoService.executarAcao(executarAcaoDto).pipe(
            tap(objeto => {
                this.toastr.success("Acão de " + this.acaoDoModal.nome + " executada com sucesso");
                                
                this.parecer = { ...parecerPadrao}
                this.setObjeto(objeto);
                

                
            }), finalize (() => { this.acaoDebounce = false; this.carregamento--})
        ).subscribe();
        

    }

    

    updateTipoPlano(po : PlanoOrcamentarioDTO) {

        this.carregamento++;
        this.tipoPlanoService.fromSigefes(po.codigo)
        .pipe(finalize(() => this.carregamento--)).subscribe({
            next: (tiposList) => {
                this.objeto.tiposPlano = tiposList

                this.objeto.tiposPlano.forEach(plano => {
                    if(!plano.id) {
                        this.tiposplano.push(plano);
                    }

                    this.opcoesTipoPlano.push({
                                label: `${plano.nome.toUpperCase()} - ${plano.sigla}`,
                                value: plano
                            })

        
                });
            }
        });
    }

    validarApontamentos() : boolean {

        let valido = true;

        this.apontamentos.forEach(apontamento => {
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
        return (<any>EtapaEnum)[this.getEtapaAtual()?.etapa.etapaId] === etapaEnum;
    }

    limparContratado() {
        this.cadastroExercicios.forEach(c => c.limparContratado());
    }


    setObjeto(objeto : IObjetoDetail) {
        this.objeto = objeto;

        
        this.dataUtil.setTitleInfo("objetoId", this.objeto.nome);
    
        this.microregiao = this.objeto.microrregiaoId ? 
                                            this.microregioes.find(value => value.id == this.objeto.microrregiaoId)
                                            : undefined;

        
        objeto.tiposPlano = this.tiposplano.filter(tipoItem => objeto.tiposPlano.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id));

        this.areaTematica = this.areasTematicas.find(area => objeto.idArea == area.id);
        this.planoOrcamentario = this.opcoesPlanosOrcamentarios.find(po => po.value?.codigo === objeto.codPlano)?.value;
        this.unidadeOrcamentaria = this.opcoesUnidades.find(optUo => optUo.value?.codigo === this.objeto.codUnidade)?.value;
        this.recursosFinanceiros = [];
        Object.entries(objeto.custos).forEach(([anoStr, fontes]) => {
            const _fontes = [] as IFonteExercicio[];

            Object.entries(fontes).forEach(([codFonte, valores] : [string, Custo]) => {
                this.fonteSrv.findByCodigo(codFonte).subscribe(fonte => {
                    _fontes.push({
                        fonteOrcamentaria: fonte,
                        planejado: valores.planejado,
                        contratado: valores.contratado
                    })
                })
            })

            this.recursosFinanceiros.push({
                anoExercicio: Number(anoStr),
                indicadaPor: _fontes
            })
        })

        this.carregamento++;
        this.apontamentoSrv.findByObjeto(objeto.id)
        .pipe(finalize(() => this.carregamento--))
        .subscribe({
            next: (apontamentos) => {
                this.apontamentos = apontamentos;
                
                this.feedback = [...this.apontamentos];
            }
        })


        this.carregamento++;
        this.usuarioService.getUser().pipe(
            tap(user => {
                this.userId = user.id;
                this.grupoService.findByUsuario(user.id).pipe(
                    tap(grupos => {
                        this.executaAcao = grupos.map(g => g.id).includes(this.getEtapaAtual().etapa.grupoResponsavel.id)
                                           || Boolean(user.role.find(funcao => funcao.nome === "GESTOR_MASTER"));
                    })
                ).subscribe()
            })
        ).pipe(finalize(() => this.carregamento--)).subscribe()

        this.acaoDoModal = this.getEtapaAtual().etapa.acoes.find(acao => acao.positivo !== undefined && !acao.positivo);
        this.recarregarFluxo();
              
        this.acoesNegativas = this.getEtapaAtual().etapa.acoes.filter(a => a.positivo !== undefined && !a.positivo);
        this.acoesPositivas = this.getEtapaAtual().etapa.acoes.filter(a => a.positivo !== undefined && a.positivo);


    }

    getEtapaAnterior() : IEtapa {
        let nOrdem = this.getEtapaAtual().etapa.ordem;
        
        if (nOrdem === 0)
            return undefined;

        return this.fluxo.etapas.find(e => e.ordem === nOrdem - 1)
    }

    doExibirFeedBack(){
        this.exibirFeedback = true;
    }

    recarregarFluxo(){
        if(!this.fluxo)
            return;


        let status = 0;
        let posStep = 1300/(this.fluxo.etapas.length - 1);

        let posInicial = -20;
        this.fluxo.etapas.forEach((etapa, i) => {
            let pos = (i * posStep) + 50;
            if(etapa.id == this.getEtapaAtual().etapa.id){
                this.etapasStatus.push({
                    etapa: etapa,
                    status: 1,
                    pos: pos,
                    timestamp: this.getUltimoEtapaByEtapa(etapa)?.timestamp
                })
                this.linhas.push({
                    status: 1,
                    posInicial: posInicial,
                    posFinal: pos
                })
                posInicial = pos
                status = 2
            } else {
                
                let acaoPositivo = this.getEtapaAtual().etapa.acoes.find(acao => acao.positivo);

                let statusFinal = (acaoPositivo.proxEtapaId === etapa.id)
                                && this.getEtapaAtual().devolvido ? -1 : status

                this.etapasStatus.push({
                    etapa: etapa,
                    status: statusFinal,
                    pos: pos,
                    timestamp: this.getUltimoEtapaByEtapa(etapa)?.timestamp

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

    getUltimoEtapaByEtapa(etapa) {
        const list = this.objeto.emEtapa.filter(ee => ee.etapa.id == etapa.id);

        if(list.length == 0) {
            return undefined;
        } else {
            return [...list].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0]
        }
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
        this.areaTematica = this.areasTematicas.find(area => this.objeto.idArea == area.id);
    }

    setPlanos (planoList : PlanoOrcamentarioDTO[]) {
        this.opcoesPlanosOrcamentarios = planoList.map(
            plano => { return {
                label: plano.codigo + ' - ' + plano.nome,
                value: plano
            }}
        )   

        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.planoOrcamentario = this.opcoesPlanosOrcamentarios.find(opt => opt.value?.codigo === this.objeto.codPlano)?.value
        
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
        this.unidadeOrcamentaria = this.opcoesUnidades.find(opt => opt.value?.codigo === this.objeto.codUnidade )?.value
    }

    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }

    setTiposPlano(tipoPlanoList : ITipoPlano[]) {
        this.tiposplano = tipoPlanoList;

        this.objeto.tiposPlano = this.tiposplano.filter(tipoItem => this.objeto.tiposPlano?.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id));
        
        this.opcoesTipoPlano = tipoPlanoList.map(
            tpPlano => { return {
                    label: `${tpPlano.nome.toUpperCase()} - ${tpPlano.sigla}`,
                    value: tpPlano
                }

            }
        )
    }

    setMicrorregioes(localidadeList : LocalidadeDTO[]){
        this.microregioes = localidadeList;

        this.microregiao = this.objeto.microrregiaoId ? 
                                        this.microregioes.find(value => value.id == this.objeto.microrregiaoId)
                                        : null;

    }

    ngAfterViewInit(): void {

        this.carregamento++;
        merge(            
            this.unidadeService.getFromSigefes().pipe(
                tap(unidadeList => this.setUnidades(unidadeList))
            ),
            this.localidadeService.findAll().pipe(
                tap(localidadeList => this.setMicrorregioes(localidadeList))
            ),
            this.tipoPlanoService.findBy().pipe(
                tap(tipoPlanoList => this.setTiposPlano(tipoPlanoList as ITipoPlano[]))
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
            ),
            this.permissaoService.isGestorMaster().then(isGestor => this.isGestorMaster = isGestor)
        ).pipe(finalize(() => {
            this.route.params.pipe(
                tap(params => {
                    let objetoId = params["objetoId"];
                    
                    if(!objetoId) {
                        this.toastr.error("Id do objeto inexistente");
                        this.router.navigate([".."], {relativeTo: this.route});
                    }
                    this.carregamento++;
                    concat(
                        this.objetoService.getById(objetoId).pipe(
                            tap(objeto => {
                                
                                this.fluxoService.findWithEtapa(this.getEtapaAtual(objeto).etapa.etapaId).pipe(
                                    tap(fluxo => this.setFluxo(fluxo)),
                                    finalize(() => this.setObjeto(objeto))
                                ).subscribe()
                                
    
                            })
                        )
                    ).pipe(finalize(() => this.carregamento--)).subscribe()
                    
    
                })
            ).subscribe();
            this.carregamento--;
        })).subscribe();

        

    }

    acaoDebounce = false;

    executarAcao(acao : IAcao){

        if(this.acaoDebounce) return;

        this.acaoDebounce = true;


        let exercValidos = true;

        this.cadastroExercicios.forEach(
            exercicio => {
                if(!exercicio.validar())
                     exercValidos = false
            }
        )

        if(acao.positivo && (!exercValidos || !this.validarForm())) {
            this.toastr.error("Favor preeencher os campos obrigatórios");
            this.acaoDebounce = false;
        } else {
            let objetoFinal : IObjetoCadastroForm = this.gerarObjetoFinal()

            let executarAcaoDto : IExecutarAcao = {
                acao: acao,
                apontamentos: [],
                objeto: objetoFinal
            }
            
            if(acao.positivo){
                this.carregamento++;
                this.acaoService.executarAcao(executarAcaoDto).pipe(
                    tap(objeto => {
                        this.toastr.success("Acão de " + acao.nome + " executada com sucesso");
                        if(objeto?.emStatus.status.statusId == StatusEnum.CADASTRADO){
                            this.router.navigate([".."], {relativeTo: this.route});
                        } else {
                            this.setObjeto(objeto);
                        }
                        
                    }),
                    finalize(() => { this.acaoDebounce = false; this.carregamento-- })
                ).subscribe();
            } else {
                if(acao.proxEtapaId){
                    this.acaoDebounce = false;
                    this.exibirModal = true;
                } else {
                    let resp = confirm("Se você remover o objeto ele será excluido definitivamente.\n Tem certeza que deseja excluir?");
                    if(resp){
                        this.carregamento++;
                        this.acaoService.executarAcao(executarAcaoDto).pipe(
                            tap(objeto => {
                                this.toastr.success("Objeto excluido com sucesso");
                                this.router.navigate([".."], {relativeTo: this.route});
                                
                            }), finalize(() => { this.acaoDebounce = false; this.carregamento--})
                        ).subscribe();
                    }
                }

                
                
            }
            
        }

        this.checado = true;
        
    }

    validarForm() : boolean {

        let valido = !!this.objeto.tipoObjeto
                && !!this.objeto.tipoInvestimento
                && !!this.objeto.nome 
                && !!this.objeto.descricao 
                && !!this.unidadeOrcamentaria
                && !!this.microregiao
                && !!this.objeto.tiposPlano 
                && this.objeto.tiposPlano.length > 0
                && !!this.objeto.possuiOrcamento;

        if(this.checarEtapaEnum(EtapaEnum.CADASTRO_PO)) {
            valido = valido 
                && !!this.planoOrcamentario
        }

        return valido;
    }

    gerarObjetoFinal() : IObjetoCadastroForm {
        
        
        let objetoForm : IObjetoCadastroForm = {
            id: this.objeto.id,
            gnd: this.gnd,
            tipoConta: this.objeto.tipoInvestimento,
            tipo: this.objeto.tipoObjeto,
            areaTematicaId: this.objeto.idArea,
            contrato: this.objeto.contrato,
            descricao: this.objeto.descricao,
            hashProposta: this.objeto.hashProposta,
            infoComplementares: this.objeto.infoComplementar,
            microregiaoId: this.objeto.microrregiaoId,
            nome: this.objeto.nome,
            planoOrcamentario: this.planoOrcamentario,
            planos: this.objeto.tiposPlano,
            possuiOrcamento: this.objeto.possuiOrcamento,
            unidadeOrcamentaria: this.unidadeOrcamentaria,
            recursos: this.recursosFinanceiros.map(
                custo => ({
                    ano: custo.anoExercicio,
                    valoresFontes: custo.indicadaPor.map(
                        indiPor => ({
                            fonte: indiPor.fonteOrcamentaria,
                            contratado: indiPor.contratado,
                            planejado: indiPor.planejado
                        } as CadastroValoresFonte)
                    )
                })
            )  
        };
                    
        return objetoForm;
    }
    
    removerExercicio(exerc : ICusto) {
        this.recursosFinanceiros = this.recursosFinanceiros.filter(exercicio => exercicio !== exerc );
    }

    addExercicio() {
        this.recursosFinanceiros.push({
            anoExercicio: this.recursosFinanceiros.length > 0 ? this.recursosFinanceiros[this.recursosFinanceiros.length-1].anoExercicio + 1 : new Date().getFullYear(),
            indicadaPor: [{fonteOrcamentaria: null, gnd: 4}],
            
        })
    }

    getEtapaAtual(obj?: IObjetoDetail) {
        obj = obj ?? this.objeto;

        if (!obj?.emEtapa || obj?.emEtapa?.length === 0) {
            return null;
        }

        return [...obj.emEtapa]
            .sort((a, b) =>{
                if(!a.timestamp) return 1;
                if(!b.timestamp) return -1;

                return Date.parse(b.timestamp) - Date.parse(a.timestamp)
            })[0];
    }


}

