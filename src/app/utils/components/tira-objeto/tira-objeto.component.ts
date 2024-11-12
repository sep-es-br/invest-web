import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { InvestimentoDTO } from "../../models/InvestimentoDTO";
import { ShortStringPipe } from "../../pipes/shortString.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { CustomCurrencyPipe } from "../../pipes/customCurrency.pipe";
import { ObjetoDTO } from "../../models/ObjetoDTO";

@Component({
    selector: 'spo-tira-objeto',
    templateUrl: './tira-objeto.component.html',
    styleUrl: './tira-objeto.component.scss',
    standalone: true,
    imports: [CommonModule, ShortStringPipe, FontAwesomeModule, CustomCurrencyPipe]
})
export class TiraObjetoComponent {

    toggleSeta = faAngleRight;

    aberto : boolean = false;

    @Input() objeto! : ObjetoDTO;

    
}