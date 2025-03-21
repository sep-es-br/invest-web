import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { CustomCurrencyPipe } from "../../pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../pipes/numero-resumido.pipe";
import { ObjetoTiraDTO } from "../../models/ObjetoTiraDTO";

@Component({
    selector: 'spo-tira-objeto',
    templateUrl: './tira-objeto.component.html',
    styleUrl: './tira-objeto.component.scss',
    imports: [CommonModule, CustomCurrencyPipe, NumeroResumidoPipe]
})
export class TiraObjetoComponent{
    


    @Input() objeto! : ObjetoTiraDTO;

    
}