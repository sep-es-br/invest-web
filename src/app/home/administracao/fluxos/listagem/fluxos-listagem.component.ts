import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
    standalone: true,
    templateUrl: "./fluxos-listagem.component.html",
    styleUrl: "./fluxos-listagem.component.scss",
    imports: [CommonModule, FontAwesomeModule, RouterModule]
})
export class FluxosListagemComponent {
    
    addIcon = faPlusCircle;

    constructor(
        private router : Router
    ) {

    }

}