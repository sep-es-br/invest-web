import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormsModule, NgForm, NgModel, ReactiveFormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { LocalidadeDTO } from "../../../../utils/models/LocalidadeDTO";
import { CadastroExercicioComponent } from "./cadastro-exercicio/cadastro-exercicio.component";
import { ICusto } from "./exercicio-cadastro.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faPaperPlane, faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { filter, finalize, forkJoin, map, merge, Observable, switchMap, tap } from "rxjs";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { LocalidadeService } from "../../../../utils/services/localidade.service";
import { ToastrService } from "ngx-toastr";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { ITipoPlano } from "../../../../utils/interfaces/ITipoPlano";
import { TipoPlanoService } from "../../../../utils/services/tipoPlano.service";
import { AreaTematicaService } from "../../../../utils/services/areaTematica.service";
import { IAreaTematica } from "../../../../utils/interfaces/IAreaTematica";
import { ISelectOpcao } from "../../../../utils/interfaces/selectOption.interface";
import { NgSelectComponent } from "@ng-select/ng-select";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { ProgressModalComponent } from "../../../../utils/components/progress-modal/progress-modal.component";
import { PROPOSTA_ATIVA } from "../../../../utils/sessionLocalItems.const";
import { IProposta } from "../../../../utils/interfaces/proposta.interface";
import { IObjetoDetail } from "../../../../utils/interfaces/objetoDetail.interface";
import { FonteOrcamentariaService } from "../../../../utils/services/fonteOrcamentaria.service";
import { IFonteExercicio } from "./fonte-exercicio.interface";
import { IObjetoCadastroForm, ICusto as CadastroCusto, IValoresFonte as CadastroValoresFonte } from "../../../../utils/interfaces/objeto-cadastro-form.interface";
import { CadastroInvestimentoService } from "../../../../utils/services/cadastro-investimento.service";
import { IDoUnload } from "../../../../utils/guard/DoUnload.interface";
import { ConfigGeraisService } from "../../../../utils/services/config-gerais.service";
import { StatusEnum } from "../../../../utils/enum/status.enum";

@Component({
    templateUrl: "./objeto-cadastro.component.html",
    styleUrl: "./objeto-cadastro.component.scss",
    imports: [
        CommonModule, ReactiveFormsModule, ProgressModalComponent, 
        CadastroExercicioComponent, FontAwesomeModule, FormsModule, NgSelectComponent
    ]
})
export class ObjetoCadastroComponent implements OnInit, AfterViewInit, OnDestroy, IDoUnload {

    @ViewChildren(CadastroExercicioComponent) cadastroExercicios : QueryList<CadastroExercicioComponent>;
    @ViewChild('cadastroObjeto') cadastroObjeto : NgForm;

    addIcon = faPlusCircle;
    limparIcon = faXmarkCircle;
    salvarIcon = faFloppyDisk;
    enviarIcon = faPaperPlane;

    disableUoPo = false;


    opcoesUnidades : ISelectOpcao<UnidadeOrcamentariaDTO>[];
    opcoesPlanosOrcamentarios : ISelectOpcao<PlanoOrcamentarioDTO>[];
    opcoesTipoPlano : ISelectOpcao<ITipoPlano>[];

    unidades : UnidadeOrcamentariaDTO[];
    planosOrcamentario : PlanoOrcamentarioDTO[];
    microregioes : LocalidadeDTO[];
    tiposplano : ITipoPlano[];
    areasTematicas : IAreaTematica[];

    unidadesFiltrados : UnidadeOrcamentariaDTO[]
    planosFiltrados : PlanoOrcamentarioDTO[];

    checado = false;

    podeVerUnidades = false;

    daProposta = false;

    carregamento = 0;

    gnd : number = 4;

    cadastrado = false;
    emPeriodoRevisao = false;

    constructor(
        private unidadeService : UnidadeOrcamentariaService,
        private planoService : PlanoOrcamentarioService,
        private localidadeService : LocalidadeService,
        private toastr : ToastrService,
        private objetoService : ObjetosService,
        private router : Router,
        private route : ActivatedRoute,
        private dataUtil: DataUtilService,
        private tipoPlanoService : TipoPlanoService,
        private areaTematicaService : AreaTematicaService,
        private permissaoService : PermissaoService,
        private fonteSrv : FonteOrcamentariaService,
        private cadastroInvestimentoService : CadastroInvestimentoService,
        private readonly configGeraisSrv : ConfigGeraisService
    ) {}

    @ViewChild('inNome') inNome: NgModel;

    objeto : IObjetoDetail = {
        tipoInvestimento: "Investimento",
        tipoObjeto: "Projeto",
        new: true
    } as IObjetoDetail

    recursosFinanceiros : ICusto[] = [];
    planoOrcamentario : PlanoOrcamentarioDTO;
    unidadeOrcamentaria : UnidadeOrcamentariaDTO;
    areaTematica : IAreaTematica;
    microrregiao : LocalidadeDTO;

    saved = false;

    unload: () => boolean | Observable<boolean> = () => {
        if(!this.saved && this.objeto.new) {
            this.cadastroInvestimentoService.removerObjeto(this.cadastroInvestimentoService.objAtivo);
        }

        return true;
    };

    ngOnDestroy(): void {
        sessionStorage.removeItem(PROPOSTA_ATIVA)
    }

    ngOnInit(): void {

        this.recursosFinanceiros = [
            {
                anoExercicio: new Date().getFullYear(),
                indicadaPor : [
                    {
                        fonteOrcamentaria: null, 
                        planejado: null,
                        contratado: null,
                        gnd: 4
                    }
                ]
            }
        ]

        this.carregamento++;

        this.permissaoService.getPermissao("carteiraobjetos").pipe(
            switchMap((permissao) => {
                this.podeVerUnidades = permissao.verTodasUnidades;

                return forkJoin({
                    localidadeList: this.localidadeService.findAll(),
                    tipoPlanoList: this.tipoPlanoService.findBy(),
                    areasTematicas: this.areaTematicaService.findAllAreaTematica(),
                    planoList: this.planoService.getDoSigefes(null),
                    unidadeList: this.podeVerUnidades
                                    ? this.unidadeService.getFromSigefes()
                                    : this.unidadeService.getUnidadeDoUsuario(),
                    emRevisao: this.configGeraisSrv.checarEmRevisao()
                })

            }),
            tap(({areasTematicas, localidadeList,planoList,tipoPlanoList,unidadeList, emRevisao}) => {
                this.setUnidades(unidadeList);
                this.setMicrorregioes(localidadeList);
                this.setTiposPlano(tipoPlanoList as ITipoPlano[]);
                this.setAreasTematicas(areasTematicas);
                this.setPlanos(planoList);
                this.emPeriodoRevisao = emRevisao.valueOf();

                this.objeto.tiposPlano = [(tipoPlanoList as ITipoPlano[]).find(value => value.sigla === 'PIP')];

                if(unidadeList?.length == 1) {
                    this.unidadeOrcamentaria = unidadeList[0]
                }
                
                let proposta: IProposta = JSON.parse(sessionStorage.getItem(PROPOSTA_ATIVA));
                
                if(proposta) {
                    this.daProposta = true;

                    const planoDA = (tipoPlanoList as ITipoPlano[]).find(value => value.sigla === 'DA');

                    Object.assign(this.objeto, {
                        hashProposta: proposta.syncHash,
                        descricao: proposta.proposalText,
                        tiposplano: [ ...(this.objeto.tiposPlano ?? []), ...(planoDA ? [planoDA] : [])]
                    })
                    
                    this.areaTematica = areasTematicas.find(value => value.nome === proposta.areaName),
                    this.microrregiao = localidadeList.find(value => value.nome === proposta.microrregion),
                    this.unidadeOrcamentaria = unidadeList.find(value => value.codigo === proposta.budgetUnitId)

                } else if(this.cadastroInvestimentoService.objAtivo != undefined){
                    
                    this.setObjeto(this.cadastroInvestimentoService.investimento.objetos[this.cadastroInvestimentoService.objAtivo])

                    this.disableUoPo = true;
                    
                    if(this.cadastroInvestimentoService.investimento.id) 
                    this.dataUtil.setTitleInfo("id", this.cadastroInvestimentoService.investimento.nome.length > 50 
                        ? `${this.cadastroInvestimentoService.investimento.nome.substring(0, 50)}...` 
                        : this.cadastroInvestimentoService.investimento.nome)

                } else {
                    this.route.params
                        .pipe(
                            map(params => params['objetoId']),
                            filter(objetoId => !!objetoId), // ignora se undefined ou null
                            switchMap(objetoId => {
                                this.carregamento++;
                                return this.objetoService.getById(objetoId).pipe(
                                    tap(obj => this.setObjeto(obj)),
                                    finalize(() => this.carregamento--)
                                );
                            })
                            
                        )
                        .subscribe();
                }

            }),
            finalize(() =>  this.carregamento--)
        ).subscribe();

        

    }

    updateTipoPlano(po : PlanoOrcamentarioDTO) {
        this.tipoPlanoService.fromSigefes(po.codigo)
        .subscribe({
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

    setMicrorregioes(microrregiaoList : LocalidadeDTO[]) {
        this.microregioes = microrregiaoList;
    }

    setObjeto(objeto : IObjetoDetail) {
        this.objeto = objeto;
        this.cadastrado = objeto.emStatus.status.statusId === StatusEnum.CADASTRADO;

       
        let nome = `${objeto.codUnidade} - Objeto - ${objeto.id}`;

        this.dataUtil.setTitleInfo('objetoId', nome);

        this.microrregiao = this.objeto.microrregiaoId ? 
            this.microregioes.find(value => value.id == this.objeto.microrregiaoId)
            : undefined;
        this.areaTematica = this.areasTematicas.find(area => objeto.idArea == area.id);

        this.planoOrcamentario = this.planosOrcamentario.find(plano => plano.codigo == objeto.codPlano);
        this.unidadeOrcamentaria = this.unidades.find(unidade => unidade.codigo === objeto.codUnidade);
        
        this.objeto.tiposPlano = this.tiposplano.filter(tipoItem => objeto.tiposPlano.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id));
        if(this.objeto.tiposPlano.length === 0) {
            this.updateTipoPlano(this.planoOrcamentario);
        }

        if(!objeto.custos)
            this.objeto.custos = {}


        if(Object.entries(objeto.custos).length > 0)
            this.recursosFinanceiros = [];

        Object.entries(objeto.custos).forEach(([anoStr, fontes]) => {
            const _fontes = [] as IFonteExercicio[];
            
            Object.entries(fontes).forEach(([codFonte, valores]) => {
                const { planejado, contratado } = valores;
                this.fonteSrv.findByCodigo(codFonte).subscribe(fonte => {
                    _fontes.push({
                        fonteOrcamentaria: fonte,
                        planejado,
                        contratado
                    } as IFonteExercicio)
                })
            })

            this.recursosFinanceiros.push({
                anoExercicio: Number(anoStr),
                indicadaPor: _fontes
            })
        })


    }

    checarCadastrado() {
        return this.objeto.id && !this.objeto.emEtapa;
    }

    ngAfterViewInit(): void {
        
    }

    selecionarUnidadeOrcamentaria(value1 : UnidadeOrcamentariaDTO, value2 : UnidadeOrcamentariaDTO) : boolean {
        return value1?.codigo == value2?.codigo
    }

    setAreasTematicas (areaList : IAreaTematica[]) {
        this.areasTematicas = areaList;
    }

    selecionarPlanoOrcamentario(option : ISelectOpcao<PlanoOrcamentarioDTO>, model : PlanoOrcamentarioDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    selecionarTiposPlanos(option : ISelectOpcao<ITipoPlano>, model : ITipoPlano) : boolean {
        return option.value?.id === model?.id
    }

    setPlanos (planoList : PlanoOrcamentarioDTO[]) {
        this.planosOrcamentario = planoList;
        this.filtrarPlanos("");

        this.opcoesPlanosOrcamentarios = planoList?.map(
            plano => { return {
                label: plano.codigo + ' - ' + plano.nome.toUpperCase(),
                value: plano
            }}
        )
        


        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.planoOrcamentario = this.opcoesPlanosOrcamentarios?.find(opt => opt.value?.codigo === this.objeto.codPlano )?.value
        
    }

    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }

    filtrarPlanos(filtro : string) {
        this.planosFiltrados = this.planosOrcamentario?.filter(plano => plano.nome.toUpperCase().includes(filtro.toUpperCase()) || plano.codigo.includes(filtro)); 
    }

    selecionarUnidade(option : ISelectOpcao<UnidadeOrcamentariaDTO>, model : UnidadeOrcamentariaDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    setUnidades(unidadeList : UnidadeOrcamentariaDTO[]){
        this.unidades = unidadeList;

        this.opcoesUnidades = unidadeList?.map(unidade => {
            return {
                label: unidade.codigo + ' - ' + unidade.sigla,
                value: unidade
            }
        })

        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.unidadeOrcamentaria = this.opcoesUnidades?.find(opt => opt.value?.codigo === this.objeto.codUnidade )?.value
    }

    filtrarUnidades(filtro : string) {
        this.unidadesFiltrados = this.unidades.filter(unidade => unidade.sigla.toUpperCase().includes(filtro.toUpperCase()) || unidade.codigo.includes(filtro)); 
    }

    setTiposPlano(tipoPlanoList : ITipoPlano[]) {
        this.tiposplano = tipoPlanoList;

        this.opcoesTipoPlano = tipoPlanoList.map(
            tpPlano => { return {
                    label: `${tpPlano.nome.toUpperCase()} - ${tpPlano.sigla}`,
                    value: tpPlano
                }

            }
        )
    }

    limparContratado() {
        this.cadastroExercicios.forEach(c => c.limparContratado())
    }

    salvarDebounce = false;

    salvar() {

        let exercValidos = true;

        this.cadastroExercicios.forEach(
            exercicio => {
                if(!exercicio.validar())
                     exercValidos = false
            }
        )

        if(!exercValidos || this.cadastroObjeto.invalid) {
            this.toastr.error("Favor preeencher os campos obrigatórios");
        } else if(this.cadastroInvestimentoService.objAtivo != undefined){
            this.objeto.microrregiaoId = this.microrregiao.id;
            this.objeto.custos = this.recursosFinanceiros.reduce(
                (acc, custo) => {
                    acc[custo.anoExercicio] = custo.indicadaPor
                                                .reduce(
                                                    (acc, fonteExercicio) => {
                                                        acc[fonteExercicio.fonteOrcamentaria.codigo] = {
                                                            planejado: fonteExercicio.planejado,
                                                            contratado: fonteExercicio.contratado
                                                        }
                                                        return acc;
                                                    }
                                                , {});
                    
                    return acc;
                }
            , {})
            this.cadastroInvestimentoService.patchValueObjeto(this.objeto);
            this.saved = true;
            this.router.navigate(['..'], {relativeTo: this.route})
        } else {
            
            let objetoForm : IObjetoCadastroForm = {
                id: this.objeto.id,
                tipoConta: this.objeto.tipoInvestimento,
                tipo: this.objeto.tipoObjeto,
                areaTematicaId: this.objeto.idArea,
                contrato: this.objeto.contrato,
                descricao: this.objeto.descricao,
                hashProposta: this.objeto.hashProposta,
                infoComplementares: this.objeto.infoComplementar,
                microregiaoId: this.microrregiao.id,
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
            

            if(!this.salvarDebounce) {
                this.salvarDebounce = true;
                this.carregamento++;
                this.objetoService.salvarObjeto(objetoForm).pipe(
                    tap(() => {
                        this.toastr.success("Objeto Salvo");
                        this.saved = true;
                        this.router.navigate(['../'], {relativeTo: this.route});
                    }), finalize(() => {
                        this.carregamento--;
                        this.salvarDebounce = false
                    })
    
                ).subscribe();
            }
            
            
        }

        this.checado = true;
    }

    removerExercicio(exerc : ICusto) {
        this.recursosFinanceiros = this.recursosFinanceiros.filter(exercicio => exercicio !== exerc );
    }
    
    addExercicio() {
        this.recursosFinanceiros.push({
            anoExercicio: this.recursosFinanceiros.length > 0 ? this.recursosFinanceiros[this.recursosFinanceiros.length-1].anoExercicio + 1 : new Date().getFullYear(),
            indicadaPor: [{fonteOrcamentaria: null, gnd: 4}]
        })
    }

}