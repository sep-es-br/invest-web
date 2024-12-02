import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ContentChild, ElementRef, Input, TemplateRef } from "@angular/core";
import { CustomCurrencyPipe } from "../../pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../pipes/numero-resumido.pipe";

@Component({
    selector: 'spo-valor-card',
    templateUrl: './valor-card.component.html',
    styleUrl: './valor-card.component.scss',
    standalone: true,
    imports: [CommonModule, CustomCurrencyPipe, NumeroResumidoPipe]
})
export class ValorCardComponent {
      
    @Input() public valor : number = -1;
    @Input() public cor : string = 'gray';
    @Input() public titulo : string = 'N/D';
    @Input() public nomeIcone : string = 'placeHolder';

}