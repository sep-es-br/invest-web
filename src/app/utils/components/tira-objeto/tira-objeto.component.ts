import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ShortStringPipe } from "../../pipes/shortString.pipe";
import { CustomCurrencyPipe } from "../../pipes/customCurrency.pipe";
import { ObjetoDTO } from "../../models/ObjetoDTO";
import { NumeroResumidoPipe } from "../../pipes/numero-resumido.pipe";

@Component({
    selector: 'spo-tira-objeto',
    templateUrl: './tira-objeto.component.html',
    styleUrl: './tira-objeto.component.scss',
    standalone: true,
    imports: [CommonModule, ShortStringPipe, CustomCurrencyPipe, NumeroResumidoPipe]
})
export class TiraObjetoComponent {


    @Input() objeto! : ObjetoDTO;

    
}