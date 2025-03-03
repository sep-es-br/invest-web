import { CommonModule } from "@angular/common";
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, forwardRef, HostListener, Input, input, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faChevronLeft, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import MultiSelectDropdownItemComponent from "./multSelect-dropdown-item/multSelect-dropdown-item.component";
import { ITipoPlano } from "../../interfaces/ITipoPlano";
import { tap } from "rxjs";

@Component({
    selector: "spo-multSelect-dropdown",
    standalone: true,
    templateUrl: "./multSelect-dropdown.component.html",
    styleUrl: "./multSelect-dropdown.component.scss",
    imports: [CommonModule, FontAwesomeModule],
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
    @ViewChildren('iconRemover', {read: ElementRef}) btnsRemover : QueryList<ElementRef>

    onChange = (value: any) => {};
    onTouched = () => {};

    removerIcon = faXmarkCircle;
    abrirIcon = faChevronLeft;

    value : ITipoPlano[] = [];

    valoresSelecionados : MultiSelectDropdownItemComponent[]

    @Input() valueList : IMultSelectValor[] = [];
    @Input() placeHolder : string = "Selecione as opções";

    disabled : boolean;

    fechado : boolean = true;

    constructor(
        private elementRef : ElementRef,
        private cdr: ChangeDetectorRef
    ) {}

    ngAfterContentInit(): void {
        this.itensDisponiveis.changes.pipe(tap( qList => {
            this.carregarValores();

            qList.forEach((item : any) => {
                item.registerOnChange( (value : any) => {
                    this.setValoresSelecionados(this.itensDisponiveis.filter(item => item.selecionado).map(item => item.value));
                })
            })
                        
        })).subscribe()
        
    }

    setValoresSelecionados(valores : any[]) {
        this.value = valores;
        this.carregarValores();
    }

    @HostListener('document:click', ['$event'])
    clickHost(event : MouseEvent) {
        if(!this.selectedValuesElemRef) return;

        if(!this.elementRef.nativeElement.contains(event.target)){
            this.fechado = true;
        }

    }
    isRemoveButton(target: EventTarget) {
        let retorno = false;
        
        this.btnsRemover.forEach(btn => {
            if(btn.nativeElement.contains(target))
                retorno = true;
        })
        return retorno;
    }

    remover(item: MultiSelectDropdownItemComponent){
        this.setValoresSelecionados(this.valoresSelecionados.filter(valor => valor != item).map(item => item.value));
        item.selecionado = false;
    }

    toggle(evt : MouseEvent) {
        if(this.isRemoveButton(evt.target)) return;
        this.fechado = !this.fechado;
    }


    writeValue(obj: any): void {
        
        this.value = obj;
        this.carregarValores()

        this.onTouched();
        
    }

    carregarValores() {

        let valores : MultiSelectDropdownItemComponent[] = [];

        this.itensDisponiveis?.forEach(item => {
            if(this.value?.includes(item.value))
                valores.push(item);
        })

        this.valoresSelecionados = valores;        
        this.valoresSelecionados?.forEach(valor => valor.selecionado = true);

        this.onChange(this.value);
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
