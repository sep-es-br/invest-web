import { Component, Input } from "@angular/core";
import { IDadoConsolidado } from "../../../../utils/interfaces/dado-consolidado.interface";
import { CommonModule } from "@angular/common";
import { CustomCurrencyPipe } from "../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../utils/pipes/numero-resumido.pipe";

@Component({
    selector: 'spo-tira-dado-consolidado',
    standalone: true,
    templateUrl: "./tira-dado-consolidado.component.html",
    styleUrls: [
        '../../../../utils/styles/tira-base.scss', './tira-dado-consolidado.component.scss'
    ],
    imports: [CommonModule, CustomCurrencyPipe, NumeroResumidoPipe]
})
export class TiraDadoConsolidadoComponent {

    @Input() dadoConsolidado : IDadoConsolidado;

}