import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, HostBinding, Input, OnChanges, QueryList, SimpleChanges, TemplateRef, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { CustomCurrencyPipe } from '../../pipes/customCurrency.pipe';
import { NumeroResumidoPipe } from '../../pipes/numero-resumido.pipe';
import { TiraListaCol, TiraRecord } from './TiraListaConfig';

@Component({
  selector: 'spo-tira-lista',
  imports: [CommonModule, FontAwesomeModule, CustomCurrencyPipe, NumeroResumidoPipe],
  templateUrl: './tira-lista.component.html',
  styleUrl: './tira-lista.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TiraListaComponent {
    
    @Input() lista : TiraRecord[];

    Object = Object;
    
    toggleSeta = faAngleRight;
    acoesIcon = faEllipsis;

}


