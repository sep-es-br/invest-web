import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, QueryList, ViewChildren } from "@angular/core";
import { IObjeto } from "../../../../../utils/interfaces/IObjeto";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { concat, merge, tap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ObjetosService } from "../../../../../utils/services/objetos.service";
import { DataUtilService } from "../../../../../utils/services/data-util.service";
import { IFluxo } from "../../../../../utils/interfaces/fluxo.interface";
import { IEtapa } from "../../../../../utils/interfaces/etapa.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight, faPlusCircle, faThumbsDown, faThumbsUp, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
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

@Component({
    standalone: true,
    templateUrl: "./avaliacao-vizualizar.component.html",
    styleUrl: "./avaliacao-vizualizar.component.scss",
    imports: [CommonModule, FontAwesomeModule, AvaliacaoExercicioComponent,
    MultSelectDropDownComponent, MultiSelectDropdownItemComponent,
    ReactiveFormsModule, FormsModule, OpcaoItemComponent, DropdownFiltroComponent]
})
export class AvaliacaoVizualizarComponent implements AfterViewInit {

    @ViewChildren(AvaliacaoExercicioComponent) cadastroExercicios : QueryList<AvaliacaoExercicioComponent>;

    objeto : IObjeto = {
        tipoConta: "Investimento",
        tipo: "Projeto",
        recursosFinanceiros: [],
        conta: {}
    }

    setaDireita = faChevronRight;
    
    addIcon = faPlusCircle;
    limparIcon = faXmarkCircle;
    positivoIcon = faThumbsUp;
    negativoIcon = faThumbsDown;

    fluxo : IFluxo;
    
    checado = false;

    executaAcao = false;

    unidades : UnidadeOrcamentariaDTO[];
    planosOrcamentario : PlanoOrcamentarioDTO[];
    microregioes : LocalidadeDTO[];
    tiposplano : ITipoPlano[];
    areasTematicas : IAreaTematica[];

    unidadesFiltrados : UnidadeOrcamentariaDTO[]
    planosFiltrados : PlanoOrcamentarioDTO[];

    objetoCadastro = new FormGroup({
        tipoConta: new FormControl(null, Validators.required),
        tipo: new FormControl(null, Validators.required),
        nome: new FormControl(null, Validators.required),
        descricao: new FormControl(null, Validators.required),
        unidade: new FormControl(undefined, Validators.required),
        planoOrcamentario: new FormControl(undefined),
        microregiaoAtendida: new FormControl(undefined, Validators.required),
        infoComplementares: new FormControl(null, Validators.required),
        objContratado: new FormControl(false),
        planos : new FormControl([]),
        contrato : new FormControl(null),
        areaTematica : new FormControl(null),

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
    }[] = []


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
        private acaoService : AcaoService
    ){
        
    }

    setFluxo(fluxo: IFluxo) {
        this.fluxo = fluxo;

        this.recarregarFluxo();
        
    }

    recarregarFluxo(){
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
                this.etapasStatus.push({
                    etapa: etapa,
                    status: status,
                    pos: pos

                })

                this.linhas.push({
                    status: status,
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
        if(status == 0) {
            return "M " + (pos - 6) + " 50 L " + (pos-1) + " 55 L " + (pos + 6) + " 45";
        } else {
            return "M " + (pos - 7) + " 57 L " + (pos + 7) + " 43 L " + (pos) + " 50 L " + (pos-7) + " 43 L " + (pos+7) + " 57";
        }
    }

    

    setAreasTematicas (areaList : IAreaTematica[]) {
        this.areasTematicas = areaList;
        this.objetoCadastro.controls.areaTematica.setValue(
            this.areasTematicas.find(area => this.objeto.areaTematica?.id == area.id)
        );
    }

    setPlanos (planoList : PlanoOrcamentarioDTO[]) {
        this.planosOrcamentario = planoList;
        this.objetoCadastro.controls.planoOrcamentario.setValue(
            this.planosOrcamentario.find(plano => plano.codigo == this.objeto.conta.planoOrcamentario?.codigo)
        );
        this.filtrarPlanos("");
    }

    filtrarPlanos(filtro : string) {
        this.planosFiltrados = this.planosOrcamentario.filter(plano => plano.nome.toUpperCase().includes(filtro.toUpperCase()) || plano.codigo.includes(filtro)); 
    }

    setUnidades(unidadeList : UnidadeOrcamentariaDTO[]){
        this.unidades = unidadeList;
        this.objetoCadastro.controls.unidade.setValue(
            this.unidades.find(uni => uni.codigo == this.objeto.conta.unidadeOrcamentariaImplementadora?.codigo)
        );
        this.filtrarUnidades("");
    }

    filtrarUnidades(filtro : string) {
        this.unidadesFiltrados = this.unidades.filter(unidade => unidade.sigla.toUpperCase().includes(filtro.toUpperCase()) || unidade.codigo.includes(filtro)); 
    }

    setTiposPlano(tipoPlanoList : ITipoPlano[]) {
        this.tiposplano = tipoPlanoList;

        this.objetoCadastro.controls.planos.setValue(
            this.tiposplano.filter(tipoItem => this.objeto.planos?.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id))
        );
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
            )
        ).subscribe();

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
                            this.objeto = objeto;

                            this.usuarioService.getUser().pipe(
                                tap(user => {
                                    this.grupoService.findByUsuario(user.id).pipe(
                                        tap(grupos => {
                                            this.executaAcao = grupos.map(g => g.id).includes(this.objeto.emEtapa.etapa.grupoResponsavel.id)
                                                            //    || Boolean(user.role.find(funcao => funcao.nome === "GESTOR_MASTER"));
                                        })
                                    ).subscribe()
                                })
                            ).subscribe()

                            this.fluxoService.findWithEtapa(this.objeto.emEtapa.etapa.id).subscribe(
                                fluxo => this.setFluxo(fluxo)
                            );

                            if(objeto.emEtapa.etapa.acoes.find(acao => acao.acaoId === "INCLUIR_PO"))
                                this.objetoCadastro.controls.planoOrcamentario.addValidators(Validators.required);
                                this.objetoCadastro.controls.planoOrcamentario.updateValueAndValidity();

                            this.dataUtil.setTitleInfo("objetoId", this.objeto.nome);

                            this.objetoCadastro.controls.microregiaoAtendida.setValue(
                                this.objeto.microregiaoAtendida ? 
                                this.microregioes.find(value => value.id == this.objeto.microregiaoAtendida.id)
                                : null
                            );
                
                            this.objetoCadastro.controls.unidade.setValue(
                                this.unidades.find(uni => uni.codigo == objeto.conta.unidadeOrcamentariaImplementadora.codigo)
                            );
        
                            this.objetoCadastro.controls.planoOrcamentario.setValue(
                                this.planosOrcamentario.find(plano => plano.codigo == objeto.conta.planoOrcamentario?.codigo)
                            );
                            
                            this.objetoCadastro.controls.planos.setValue(
                                this.tiposplano.filter(tipoItem => objeto.planos.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id))
                            );
        
                            this.objetoCadastro.controls.areaTematica.setValue(
                                this.areasTematicas.find(area => objeto.areaTematica?.id == area.id)
                            );
                            
                        })
                    )
                ).subscribe()
                

            })
        ).subscribe()

    }

    executarAcao(acao : IAcao){
        let exercValidos = true;

        this.cadastroExercicios.forEach(
            exercicio => {
                if(!exercicio.validar())
                     exercValidos = false
            }
        )

        if(acao.positivo && (!exercValidos || this.objetoCadastro.invalid)) {
            this.toastr.error("Favor preeencher os campos obrigatórios");
        } else {
            let objetoFinal : IObjeto = {
                id: this.objeto.id,
                ...this.objetoCadastro.getRawValue(),
                conta: {
                    planoOrcamentario: this.objetoCadastro.value.planoOrcamentario,
                    unidadeOrcamentariaImplementadora: this.objetoCadastro.value.unidade
                },
                recursosFinanceiros: this.objeto.recursosFinanceiros
            };

            let executarAcaoDto : IExecutarAcao = {
                acao: acao,
                apontamentos: [],
                objeto: objetoFinal
            }

            this.acaoService.executarAcao(executarAcaoDto).pipe(
                tap(() => {
                    this.toastr.success("Acão de " + acao.nome + " executada com sucesso");
                    this.recarregarFluxo();
                })
            ).subscribe()
            
        }

        this.checado = true;
        
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