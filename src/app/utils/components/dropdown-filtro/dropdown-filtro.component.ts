import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ShortStringPipe } from "../../pipes/shortString.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "dropdown-filtro",
    standalone: true,
    templateUrl: "./dropdown-filtro.component.html",
    styleUrl: "./dropdown-filtro.component.scss",
    imports: [CommonModule, ShortStringPipe, FontAwesomeModule],
})
export class DropdownFiltroComponent{
    
    @ViewChild("display", {read: ElementRef}) public displayElemRef : ElementRef;

    @Output() public valueChange = new EventEmitter<never>();

    @Input() public disabled : boolean;

    statusIndicador = faChevronLeft
    
    mostrarLista = false;

    constructor(
        private hostElementRef : ElementRef
    ){}

    @HostListener("document:click", ["$event"])
    clickFora(event : MouseEvent) {
        if(!this.displayElemRef) return;

        if(!this.displayElemRef.nativeElement.contains(event.target)) {
            this.mostrarLista = false;
            if(this.hostElementRef.nativeElement.contains(event.target))
                this.valueChange.emit();
        }

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