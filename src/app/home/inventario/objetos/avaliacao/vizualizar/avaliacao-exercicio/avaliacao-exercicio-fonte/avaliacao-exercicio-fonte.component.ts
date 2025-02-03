import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { IFonteExercicio } from "../../fonte-exercicio.interface";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { tap } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinusCircle, faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { OpcaoItemComponent } from "../../../../../../../utils/components/dropdown-com-filtro/opcao-item.component";
import { FonteOrcamentariaDTO } from "../../../../../../../utils/models/FonteOrcamentariaDTO";
import { FonteOrcamentariaService } from "../../../../../../../utils/services/fonteOrcamentaria.service";
import { DropdownFiltroComponent } from "../../../../../../../utils/components/dropdown-com-filtro/dropdown-com-filtro.component";
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from "@ng-select/ng-select";
import { ISelectOpcao } from "../../../../../../../utils/interfaces/selectOption.interface";

@Component({
    selector: "spo-avaliacao-exercicio-fonte",
    standalone: true, 
    templateUrl: "./avaliacao-exercicio-fonte.component.html",
    styleUrl: "./avaliacao-exercicio-fonte.component.scss",
    imports: [CommonModule, NgxMaskDirective, FontAwesomeModule, ReactiveFormsModule, DropdownFiltroComponent, OpcaoItemComponent,
        FormsModule, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective
    ],
    providers: [provideNgxMask()]
})
export class AvaliacaoExercicioFonteComponent implements OnInit {

    limparIcon = faXmarkCircle;
    removerIcon = faMinusCircle;
    addIcon = faPlusCircle;

    @Input() fonteValores : IFonteExercicio;

    @Input() lastElem : boolean;

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

        this.fonteValores.fonteOrcamentaria = this.optionsFontes.find(opt => this.selecionarFonte(opt, this.fonteValores.fonteOrcamentaria) ).value
    }

    selecionarFonte(option : ISelectOpcao<FonteOrcamentariaDTO>, model : FonteOrcamentariaDTO) : boolean {
        return option.value?.codigo === model.codigo
    }

    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }

    ngOnInit(): void {
        this.fonteService.getDoSigefes().pipe(
            tap(fonteList => this.setFontes(fonteList))
        ).subscribe();
    }

    validar() : boolean {
        this.valido = this.fonteValores.fonteOrcamentaria !== null;
        this.checado = true;

        return this.valido;
    }
}