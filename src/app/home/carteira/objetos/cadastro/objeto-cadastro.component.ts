import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { LocalidadeDTO } from "../../../../utils/models/LocalidadeDTO";
import { CheckBoxComponent } from "../../../../utils/components/checkbox/checkbox.component";
import { CadastroExercicioComponent } from "./cadastro-exercicio/cadastro-exercicio.component";
import { IObjeto } from "../../../../utils/interfaces/IObjeto";
import { ICusto } from "./exercicio-cadastro.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinusCircle, faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { concat, finalize, merge, tap } from "rxjs";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { DropdownFiltroComponent } from "../../../../utils/components/dropdown-com-filtro/dropdown-com-filtro.component";
import { LocalidadeService } from "../../../../utils/services/localidade.service";
import { FonteOrcamentariaService } from "../../../../utils/services/fonteOrcamentaria.service";
import { ToastrService } from "ngx-toastr";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { IMultSelectValor, MultSelectDropDownComponent } from "../../../../utils/components/multSelectDropDown/multSelect-dropdown.component";
import { ITipoPlano } from "../../../../utils/interfaces/ITipoPlano";
import { TipoPlanoService } from "../../../../utils/services/tipoPlano.service";
import MultiSelectDropdownItemComponent from "../../../../utils/components/multSelectDropDown/multSelect-dropdown-item/multSelect-dropdown-item.component";
import { AreaTematicaService } from "../../../../utils/services/areaTematica.service";
import { IAreaTematica } from "../../../../utils/interfaces/IAreaTematica";
import { OpcaoItemComponent } from "../../../../utils/components/dropdown-com-filtro/opcao-item.component";
import { ISelectOpcao } from "../../../../utils/interfaces/selectOption.interface";
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from "@ng-select/ng-select";

@Component({
    standalone: true,
    templateUrl: "./objeto-cadastro.component.html",
    styleUrl: "./objeto-cadastro.component.scss",
    imports: [
    CommonModule, ReactiveFormsModule,
    CadastroExercicioComponent, FontAwesomeModule,
    DropdownFiltroComponent, FormsModule,
    MultSelectDropDownComponent,
    MultiSelectDropdownItemComponent,
    OpcaoItemComponent, NgSelectComponent, NgOptionTemplateDirective, NgLabelTemplateDirective
]
})
export class ObjetoCadastroComponent implements OnInit, AfterViewInit {

    @ViewChildren(CadastroExercicioComponent) cadastroExercicios : QueryList<CadastroExercicioComponent>;

    addIcon = faPlusCircle;
    limparIcon = faXmarkCircle;


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
        private areaTematicaService : AreaTematicaService
    ) {}

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

    @ViewChild('inNome') inNome: NgModel;

    objeto : IObjeto = {
        tipoConta: "Investimento",
        tipo: "Projeto",
        recursosFinanceiros: [],
        conta: {}
    }

    ngOnInit(): void {

        this.objeto.recursosFinanceiros = [
            {
                anoExercicio: new Date().getFullYear(),
                indicadaPor : [
                    {
                        fonteOrcamentaria: null, 
                        previsto: null,
                        contratado: null
                    }
                ]
            }
        ]

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
        ).pipe(finalize(() => {
            
            this.route.params.pipe(tap(params => {
                let objetoId = params['objetoId'];
    
                if(!objetoId) return;
                this.objetoService.getById(objetoId).pipe(tap(
                    obj => {
    
                        this.setObjeto(obj)
    
                    }
                )).subscribe()
            })).subscribe();


        })).subscribe()

    }

    setMicrorregioes(microrregiaoList : LocalidadeDTO[]) {
        this.microregioes = microrregiaoList;
    }

    setObjeto(objeto : IObjeto) {
        this.objeto = objeto;

        if(this.checarCadastrado()) {
            this.objetoCadastro.controls.planoOrcamentario.addValidators(Validators.required);
            this.objetoCadastro.controls.planoOrcamentario.updateValueAndValidity();
        }
       
        let nome = `${objeto.conta.unidadeOrcamentariaImplementadora.sigla} - Objeto - ${objeto.id.split(':')[2]}`;

        this.dataUtil.setTitleInfo('objetoId', nome);

        
        this.objetoCadastro.controls.microregiaoAtendida.setValue(
            this.objeto.microregiaoAtendida ? 
            this.microregioes.find(value => value.id == this.objeto.microregiaoAtendida.id)
            : undefined
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

        this.opcoesPlanosOrcamentarios = planoList.map(
            plano => { return {
                label: plano.codigo + ' - ' + plano.nome,
                value: plano
            }}
        )
        


        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.objeto.conta.planoOrcamentario = this.opcoesPlanosOrcamentarios.find(opt => this.selecionarPlanoOrcamentario(opt, this.objeto.conta.planoOrcamentario) )?.value
        
    }

    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }

    filtrarPlanos(filtro : string) {
        this.planosFiltrados = this.planosOrcamentario.filter(plano => plano.nome.toUpperCase().includes(filtro.toUpperCase()) || plano.codigo.includes(filtro)); 
    }

    selecionarUnidade(option : ISelectOpcao<UnidadeOrcamentariaDTO>, model : UnidadeOrcamentariaDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    setUnidades(unidadeList : UnidadeOrcamentariaDTO[]){
        this.unidades = unidadeList;
        this.filtrarUnidades("");

        this.opcoesUnidades = unidadeList.map(unidade => {
            return {
                label: unidade.codigo + ' - ' + unidade.sigla,
                value: unidade
            }
        })

        // em teoria não seria nescessario essa linha, mas o select ta bugado, então...
        this.objeto.conta.unidadeOrcamentariaImplementadora = this.opcoesUnidades.find(opt => this.selecionarUnidade(opt, this.objeto.conta.unidadeOrcamentariaImplementadora) )?.value
    }

    filtrarUnidades(filtro : string) {
        this.unidadesFiltrados = this.unidades.filter(unidade => unidade.sigla.toUpperCase().includes(filtro.toUpperCase()) || unidade.codigo.includes(filtro)); 
    }

    setTiposPlano(tipoPlanoList : ITipoPlano[]) {
        this.tiposplano = tipoPlanoList;

        this.opcoesTipoPlano = tipoPlanoList.map(
            tpPlano => { return {
                    label: `${tpPlano.nome} - ${tpPlano.sigla}`,
                    value: tpPlano
                }

            }
        )

        this.tipoPlanoService.findBy(undefined, 'PIP').pipe(
            tap( tipo => {
                this.objeto.planos = [tipo];
            })
        ).subscribe()
    }

    salvar() {

        let exercValidos = true;

        this.cadastroExercicios.forEach(
            exercicio => {
                if(!exercicio.validar())
                     exercValidos = false
            }
        )

        if(!exercValidos || this.objetoCadastro.invalid) {
            this.toastr.error("Favor preeencher os campos obrigatórios");
        } else {
            let objetoFinal : IObjeto = {
                ...this.objeto,
                ...this.objetoCadastro.getRawValue(),
                conta: {
                    planoOrcamentario: this.objetoCadastro.value.planoOrcamentario,
                    unidadeOrcamentariaImplementadora: this.objetoCadastro.value.unidade
                },
                recursosFinanceiros: this.objeto.recursosFinanceiros
            };

            this.objetoService.salvarObjeto(objetoFinal).pipe(
                tap(() => {
                    this.toastr.success("Objeto Salvo");
                    this.router.navigate(['../'], {relativeTo: this.route})
                })

            ).subscribe();
            
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