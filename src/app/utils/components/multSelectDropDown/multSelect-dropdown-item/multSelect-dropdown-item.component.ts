import { AfterViewInit, Component, ContentChild, ElementRef, forwardRef, Injector, Input, ViewChild } from "@angular/core";
import { CheckboxControlValueAccessor, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { IMultSelectValor } from "../multSelect-dropdown.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: "spo-multSelect-dropdown-item",
    standalone: true,
    templateUrl: './multSelect-dropdown-item.component.html',
    styleUrl: "./multSelect-dropdown-item.component.scss",
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectDropdownItemComponent),
            multi: true
        }
    ]
})
export default class MultiSelectDropdownItemComponent implements ControlValueAccessor, AfterViewInit{
    
    @Input() value : any;
    
    @ViewChild('label', {read: ElementRef}) labelRef : ElementRef;
    
    label : string;

    selecionado : boolean;

    disabled : boolean;

    onChange = (value:any) => {};
    onTouched = () => {};
    
    ngAfterViewInit(): void {
        let labelElem = this.labelRef.nativeElement as HTMLLabelElement;

        this.label = labelElem.textContent;

    }

    mudarSelecao(event : Event) {
        this.onChange(this.value);
    }

    writeValue(obj: any): void {
        this.value = obj;
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