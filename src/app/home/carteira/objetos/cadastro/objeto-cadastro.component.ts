import { CommonModule } from "@angular/common";
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
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
import { concat, merge, tap } from "rxjs";
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

@Component({
    standalone: true,
    templateUrl: "./objeto-cadastro.component.html",
    styleUrl: "./objeto-cadastro.component.scss",
    imports: [
    CommonModule, ReactiveFormsModule, CheckBoxComponent,
    CadastroExercicioComponent, FontAwesomeModule,
    DropdownFiltroComponent, FormsModule,
    MultSelectDropDownComponent,
    MultiSelectDropdownItemComponent,
    OpcaoItemComponent
]
})
export class ObjetoCadastroComponent implements OnInit {

    @ViewChildren(CadastroExercicioComponent) cadastroExercicios : QueryList<CadastroExercicioComponent>;

    addIcon = faPlusCircle;
    limparIcon = faXmarkCircle;

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
        infoComplementares: new FormControl(null, Validators.required),
        objContratado: new FormControl(false),
        planos : new FormControl([]),
        contrato : new FormControl(null),
        areaTematica : new FormControl(null),

    });

    @ViewChild('inNome') inNome: NgModel;

    objeto : IObjeto = {
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

        this.route.params.pipe(tap(params => {
            let objetoId = params['objetoId'];

            if(!objetoId) return;

            this.objetoService.getById(objetoId).pipe(tap(
                obj => {

                    this.objeto = obj;

                    let nome = `${obj.conta.unidadeOrcamentariaImplementadora.sigla} - Objeto - ${obj.id.split(':')[2]}`;

                    this.dataUtil.setTitleInfo('objetoId', nome);

                    this.objetoCadastro.controls.microregiaoAtendida.setValue(
                        this.objeto.microregiaoAtendida ? 
                        this.microregioes.find(value => value.id == this.objeto.microregiaoAtendida.id)
                        : null
                    );

                    this.objetoCadastro.controls.unidade.setValue(obj.conta.unidadeOrcamentariaImplementadora);
                    this.objetoCadastro.controls.planoOrcamentario.setValue(obj.conta.planoOrcamentario);
                    
                    this.objetoCadastro.controls.planos.setValue(
                        this.tiposplano.filter(tipoItem => obj.planos.map( objTipoPlano => objTipoPlano.id).includes(tipoItem.id))
                    );

                }
            )).subscribe()
        })).subscribe();

        merge(
            this.unidadeService.getFromSigefes().pipe(
                tap(unidadeList => this.setUnidades(unidadeList))
            ),
            this.localidadeService.findAll().pipe(
                tap(localidadeList => this.microregioes = localidadeList)
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
        ).subscribe()

    }

    setAreasTematicas (areaList : IAreaTematica[]) {
        this.areasTematicas = areaList;
    }

    setPlanos (planoList : PlanoOrcamentarioDTO[]) {
        this.planosOrcamentario = planoList;
        this.filtrarPlanos("");
    }

    filtrarPlanos(filtro : string) {
        this.planosFiltrados = this.planosOrcamentario.filter(plano => plano.nome.toUpperCase().includes(filtro.toUpperCase()) || plano.codigo.includes(filtro)); 
    }

    setUnidades(unidadeList : UnidadeOrcamentariaDTO[]){
        this.unidades = unidadeList;
        this.filtrarUnidades("");
    }

    filtrarUnidades(filtro : string) {
        this.unidadesFiltrados = this.unidades.filter(unidade => unidade.sigla.toUpperCase().includes(filtro.toUpperCase()) || unidade.codigo.includes(filtro)); 
    }

    setTiposPlano(tipoPlanoList : ITipoPlano[]) {
        this.tiposplano = tipoPlanoList;
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
                id: this.objeto.id,
                ...this.objetoCadastro.value,
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