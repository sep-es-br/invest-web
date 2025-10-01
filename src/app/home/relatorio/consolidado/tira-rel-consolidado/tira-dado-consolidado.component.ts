import { Component, Input } from "@angular/core";
import { IDadoDetalhado } from "../../../../utils/interfaces/dado-detalhado.interface";
import { CommonModule } from "@angular/common";
import { CustomCurrencyPipe } from "../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../utils/pipes/numero-resumido.pipe";
import { ToSiglaPipe } from "../../../../utils/pipes/toSigla.pipe";
import { IDadoConsolidado } from "../../../../utils/interfaces/dado-consolidado.interface";

@Component({
    selector: 'spo-tira-dado-detalhado ',
    templateUrl: "./tira-dado-consolidado.component.html",
    styleUrls: [
        '../../../../../assets/styles/tira-base.scss', './tira-dado-consolidado.component.scss'
    ],
    imports: [CommonModule, CustomCurrencyPipe, NumeroResumidoPipe]
})
export class TiraDadoConsolidadoComponent {

    @Input() dadoConsolidado : IDadoConsolidado;

}