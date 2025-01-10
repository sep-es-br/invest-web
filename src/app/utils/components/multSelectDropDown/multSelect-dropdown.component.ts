import { CommonModule } from "@angular/common";
import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, forwardRef, HostListener, Input, input, QueryList, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faChevronLeft, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import MultiSelectDropdownItemComponent from "./multSelect-dropdown-item/multSelect-dropdown-item.component";
import { ITipoPlano } from "../../interfaces/ITipoPlano";

@Component({
    selector: "spo-multSelect-dropdown",
    standalone: true,
    templateUrl: "./multSelect-dropdown.component.html",
    styleUrl: "./multSelect-dropdown.component.scss",
    imports: [CommonModule, MultiSelectDropdownItemComponent, FontAwesomeModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultSelectDropDownComponent),
            multi: true
        }
    ]
})
export class MultSelectDropDownComponent implements ControlValueAccessor, AfterContentInit {

    @ViewChild('selectedValues', {read: ElementRef}) selectedValuesElemRef : ElementRef;

    @ContentChildren(MultiSelectDropdownItemComponent) itensDisponiveis : QueryList<MultiSelectDropdownItemComponent>

    onChange = (value: any) => {};
    onTouched = (value: any) => {};

    removerIcon = faXmarkCircle;
    abrirIcon = faChevronLeft;

    value : ITipoPlano[] = [];

    valoresSelecionados : MultiSelectDropdownItemComponent[]

    @Input() valueList : IMultSelectValor[] = []

    disabled : boolean;

    fechado : boolean = true;

    constructor(
        private elementRef : ElementRef
    ) {}

    ngAfterContentInit(): void {
        this.itensDisponiveis.forEach(item => {
            item.registerOnChange( (value : any) => {
                this.valoresSelecionados = this.itensDisponiveis.filter(item => item.selecionado);
            })
        })
    }

    @HostListener('document:click', ['$event'])
    clickHost(event : MouseEvent) {
        if(!this.selectedValuesElemRef) return;

        if(!this.elementRef.nativeElement.contains(event.target)){
            this.fechado = true;
        }

    }

    toggle() {
        this.fechado = !this.fechado;
    }


    writeValue(obj: any): void {
        
        this.value = obj;
        this.onChange(obj);
        
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}

export interface IMultSelectValor {
    display : string;
    data : any;
}