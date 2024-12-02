import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { IProfile } from "../../../../../../utils/interfaces/profile.interface";

@Component({
    selector: "spo-grupo-membro-cadastro",
    standalone: true,
    templateUrl: "./grupo-membro-cadastro.component.html",
    styleUrl: "./grupo-membro-cadastro.component.scss",
    imports: [CommonModule]
})
export class GrupoMembroCadastroComponent {

    @Output() onClose = new EventEmitter<IProfile>();

    constructor(private hostElementRef : ElementRef) {}


    fora = true;
  
    @HostListener("click", ["event"])
    clickFora (event : MouseEvent) {
        if(!this.fora){
            this.fora = true;
            return;
        }
        this.onClose.emit(null);
    }

    clickDentro(event : MouseEvent){
        this.fora = false;
    }
}