import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IFonteExercicio } from "../../fonte-exercicio.interface";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FonteOrcamentariaDTO } from "../../../../../../utils/models/FonteOrcamentariaDTO";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { NgxCurrencyDirective, provideEnvironmentNgxCurrency } from 'ngx-currency'
import { debounceTime, tap } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinusCircle, faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FonteOrcamentariaService } from "../../../../../../utils/services/fonteOrcamentaria.service";
import { ISelectOpcao } from "../../../../../../utils/interfaces/selectOption.interface";
import { NgSelectComponent } from "@ng-select/ng-select";

@Component({
    selector: "spo-cadastro-exercicio-fonte",
    templateUrl: "./cadastro-exercicio-fonte.component.html",
    styleUrl: "./cadastro-exercicio-fonte.component.scss",
    imports: [
        CommonModule, FormsModule, NgxCurrencyDirective , FontAwesomeModule,
        NgSelectComponent
    ]
})
export class CadastroExercicioFonteComponent implements OnInit {

    limparIcon = faXmarkCircle;
    removerIcon = faMinusCircle;
    addIcon = faPlusCircle;

    @Input() fonteValores : IFonteExercicio;

    @Input() lastElem : boolean;
    @Input() contratadoEditavel : boolean = false;
    @Input() cadastrado : boolean = false;
    @Input() emPeriodoRevisao : boolean = false;

    @Output() onRemover = new EventEmitter<IFonteExercicio>();
    @Output() onAdd = new EventEmitter<never>();

    optionsFontes : ISelectOpcao<FonteOrcamentariaDTO>[];

    public valido = false;
    public checado = false;

    constructor(
        private fonteService : FonteOrcamentariaService
    ) {}


    setFontes(fontList: FonteOrcamentariaDTO[]) {

        this.optionsFontes = [];

        this.optionsFontes.push(...fontList.map(fonte => {
            return {
                label: `${fonte.codigo} - ${fonte.nome}`,
                value: fonte
            }
        }))

        this.fonteValores.fonteOrcamentaria = this.optionsFontes.find(opt => this.selecionarFonte(opt, this.fonteValores.fonteOrcamentaria) )?.value
    }

    selecionarFonte(option : ISelectOpcao<FonteOrcamentariaDTO>, model : FonteOrcamentariaDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }

    ngOnInit(): void {
        this.fonteService.extras().pipe(
            tap(fonteList => this.setFontes(fonteList))
        ).subscribe();
    }

    limparContratado() {
        this.fonteValores.contratado = undefined;
    }

    validar() : boolean {
        this.valido = !!this.fonteValores.fonteOrcamentaria;
        this.checado = true;

        return this.valido;
    }
}