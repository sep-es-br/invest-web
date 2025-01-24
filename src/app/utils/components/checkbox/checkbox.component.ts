import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR, ReactiveFormsModule, SelectControlValueAccessor } from "@angular/forms";
import { InfosService } from "../../services/infos.service";
import { CommonModule } from "@angular/common";
import { tap } from "rxjs";

@Component({
    selector: "spo-checkbox",
    standalone: true,
    templateUrl: "./checkbox.component.html",
    styleUrl: "./checkbox.component.scss",
    imports: [CommonModule, ReactiveFormsModule],
    providers:[{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: CheckBoxComponent
    }]
})
export class CheckBoxComponent implements ControlValueAccessor {
    value : boolean = false;
    
    @HostBinding("style.background") background = "white";

    editavel : boolean;

    onChange: (val: boolean) => {};
    onTouched!: () => {};

    @HostListener("click", ["$event"])
    click(event : MouseEvent) {
        this.writeValue(!this.value);
    }

    writeValue(obj: any): void {
        this.value = Boolean(obj);
        this.background = this.value ? "var(--cor-primaria)" : "white"
    }
    
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.editavel = isDisabled;
    }

    
}