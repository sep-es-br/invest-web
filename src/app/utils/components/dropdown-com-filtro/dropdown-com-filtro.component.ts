import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ShortStringPipe } from "../../pipes/shortString.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "dropdown-com-filtro",
    standalone: true,
    templateUrl: "./dropdown-com-filtro.component.html",
    styleUrl: "./dropdown-com-filtro.component.scss",
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownFiltroComponent),
            multi: true
        }
    ]
})
export class DropdownFiltroComponent implements OnInit, ControlValueAccessor{
    
    @ViewChild("display", {read: ElementRef}) public displayElemRef : ElementRef;
    @ViewChild("inputFilter", {read: ElementRef}) public inputFilterRef : ElementRef;

    @Output() public valueChange = new EventEmitter<never>();
    @Output() public onFilterChange = new EventEmitter<string>();

    @Input() public disabled : boolean;

    onChange : (value: any) => void;
    onTouched : (value: any) => void;

    statusIndicador = faChevronLeft
    
    mostrarLista = false;
    
    filterControl = new FormControl("");

    value : any

    constructor(
        private hostElementRef : ElementRef
    ){}

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

    @HostListener("document:click", ["$event"])
    clickFora(event : MouseEvent) {
        if(!this.displayElemRef) return
        if(!this.displayElemRef.nativeElement.contains(event.target)
            && !this.inputFilterRef.nativeElement.contains(event.target)    
        ) {
            this.mostrarLista = false;
            if(this.hostElementRef.nativeElement.contains(event.target))
                this.valueChange.emit();
        }

    }

    ngOnInit(): void {
        this.filterControl.valueChanges.subscribe(
            value => this.onFilterChange.emit(value)
        );
    }

    altenarLista() {
        if(this.disabled) return;

        this.mostrarLista = !this.mostrarLista
    }

}

export interface IDropdownFiltroItem {

    label : string,
    value : any

}