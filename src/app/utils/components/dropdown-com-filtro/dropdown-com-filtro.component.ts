import { CommonModule } from "@angular/common";
import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, QueryList, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ShortStringPipe } from "../../pipes/shortString.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { OpcaoItemComponent } from "./opcao-item.component";

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
export class DropdownFiltroComponent implements OnInit, AfterContentInit, ControlValueAccessor{
    
    @ViewChild("display", {read: ElementRef}) public displayElemRef : ElementRef;
    @ViewChild("inputFilter", {read: ElementRef}) public inputFilterRef : ElementRef;
    @ContentChildren(OpcaoItemComponent, {read:OpcaoItemComponent}) public opcoesElem : QueryList<OpcaoItemComponent>

    @Output() public valueChange = new EventEmitter<never>();
    @Output() public onFilterChange = new EventEmitter<string>();

    evtEmitterOnChange = new EventEmitter<any>();

    @Input() public disabled : boolean;
    @Input() placeHolder : string;
    @Input() equals : (v1 : any, v2: any) => boolean = (v1, v2) => v1 == v2;

    onChange : (value: any) => void;
    onTouched : () => void;

    statusIndicador = faChevronLeft;

    selectedOption : OpcaoItemComponent;
    value : any;
    
    mostrarLista = false;
    
    filterControl = new FormControl("");


    constructor(
        private hostElementRef : ElementRef
    ){}

    writeValue(obj: any): void {
        this.value = obj;
        this.updateValue();
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

    updateValue(){
        this.updateValueWith(this.opcoesElem);
    }

    updateValueWith(list :  QueryList<OpcaoItemComponent>){
        this.selectedOption = list?.find(opcao => this.equals(opcao.value, this.value));
        if(this.onChange) this.onChange(this.value)
    }

    ngAfterContentInit(): void {
        this.opcoesElem.changes.subscribe((qList : QueryList<OpcaoItemComponent>) => {
            
            this.value = qList.find(item => this.equals(item, this.value))?.value
            this.updateValueWith(qList);
            qList.forEach(opcao => {
                opcao.onSelect = (v : any) => {
                    this.selectedOption = opcao;
                    this.value = v;
                    this.onChange(v);
                }
            })
        })
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