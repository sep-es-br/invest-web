import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IFluxo } from "../../../../utils/interfaces/fluxo.interface";
import { FormsModule } from "@angular/forms";
import { faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";

@Component({
    standalone: true,
    templateUrl: "./fluxo-cadastro.component.html",
    styleUrl: "./fluxo-cadastro.component.scss",
    imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class FluxoCadastroComponent {

    addEtapaIcon = faPlusCircle;
    removerEtapaIcon = faXmarkCircle;

    standaloneNgModelOption = {
        standalone: true
    }

    fluxo : IFluxo = {
        nome: "",
        etapas: []
    };

    gruposList : GrupoDTO[];

    constructor(

    ){
        this.addEtapa()
    }

    addEtapa() {
        this.fluxo.etapas.push({
            nome: "",
            status: "",
            grupoResponsavel: undefined,
            acoes: []
        });
    }

}