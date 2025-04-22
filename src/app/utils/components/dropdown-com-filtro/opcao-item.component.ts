import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
    selector: "spo-opcao-item",
    template: "{{text}}",
    imports: [CommonModule]
})
export class OpcaoItemComponent {
    
    @Input() value: any;

    @Input() text : string;

    onSelect = (value: any) => {}


    @HostListener("click", ["$event"])
    click(event : MouseEvent) {
        this.onSelect(this.value)
    }

}