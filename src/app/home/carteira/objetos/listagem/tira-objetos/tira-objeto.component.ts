import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ObjetoTiraDTO } from "../../../../../utils/models/ObjetoTiraDTO";
import { CustomCurrencyPipe } from "../../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../../utils/pipes/numero-resumido.pipe";
import { ShortStringPipe } from "../../../../../utils/pipes/shortString.pipe";

@Component({
    selector: 'spo-tira-listagem-objetos',
    templateUrl: './tira-objeto.component.html',
    styleUrl: './tira-objeto.component.scss',
    standalone: true,
    imports: [CommonModule, ShortStringPipe, CustomCurrencyPipe, NumeroResumidoPipe]
})
export class TiraObjetoComponent {


    @Input() objeto : ObjetoTiraDTO;

    
}