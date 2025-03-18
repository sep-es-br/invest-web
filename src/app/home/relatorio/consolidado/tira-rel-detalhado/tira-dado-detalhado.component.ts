import { Component, Input } from "@angular/core";
import { IDadoDetalhado } from "../../../../utils/interfaces/dado-detalhado.interface";
import { CommonModule } from "@angular/common";
import { CustomCurrencyPipe } from "../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../utils/pipes/numero-resumido.pipe";
import { ToSiglaPipe } from "../../../../utils/pipes/toSigla.pipe";

@Component({
    selector: 'spo-tira-dado-detalhado ',
    standalone: true,
    templateUrl: "./tira-dado-detalhado.component.html",
    styleUrls: [
        '../../../../utils/styles/tira-base.scss', './tira-dado-detalhado.component.scss'
    ],
    imports: [CommonModule, CustomCurrencyPipe, NumeroResumidoPipe, ToSiglaPipe]
})
export class TiraDadoDetalhadoComponent {

    @Input() dadoDetalhado : IDadoDetalhado;

}