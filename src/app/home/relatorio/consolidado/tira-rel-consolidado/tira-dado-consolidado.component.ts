import { Component } from "@angular/core";
import { IDadoConsolidado } from "../../../../utils/interfaces/dado-consolidado.interface";

@Component({
    standalone: true,
    templateUrl: './tira-dado-consolidado.component.html',
    styleUrls: ['../../../../utils/styles/tira-base.scss']
})
export class TiraDadoConsolidadoComponent {

    dadoConsolidado : IDadoConsolidado;

}