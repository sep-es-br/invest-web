import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ElementRef, HostBinding, Input, OnChanges, QueryList, SimpleChanges, TemplateRef, ViewChildren, ViewEncapsulation, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { FaIconComponent, FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { CustomCurrencyPipe } from '../../pipes/customCurrency.pipe';
import { NumeroResumidoPipe } from '../../pipes/numero-resumido.pipe';
import { LARGURA_FUNC, TiraListaCol, TiraRecord } from './TiraListaConfig';
import { OverlayDirective } from "../../directive/overflow.directive";

@Component({
  selector: 'spo-tira-lista',
  imports: [CommonModule, FontAwesomeModule, CustomCurrencyPipe, NumeroResumidoPipe, OverlayDirective],
  templateUrl: './tira-lista.component.html',
  styleUrl: './tira-lista.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({height: '0'}),
        animate('300ms ease-in', style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate('300ms ease-out', style({height: '0'}))
      ])
    ]),
    trigger('openClose200', [
      transition(':enter', [
        style({height: '0'}),
        animate('200ms ease-in', style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate('200ms ease-out', style({height: '0'}))
      ])
    ])
  ]
})
export class TiraListaComponent<T> {
    
    @ViewChildren('btnAcaoElem', {read: ElementRef}) btnsAcaoElem : QueryList<ElementRef<Element>>
    @ViewChildren('acao', {read: ElementRef}) AcaoElem : QueryList<ElementRef<Element>>

    @Input() lista : TiraRecord<T>[];
    @Input() clickFunc : (item: TiraRecord<T>) => void;
    
    LARGURA_FUNC = LARGURA_FUNC;
    
    toggleSeta = faAngleRight;
    acoesIcon = faEllipsis;

    menuItem : TiraRecord<T>;

    constructor(
      private elementRef : ElementRef<HTMLElement>
    ){
      
    }

    @HostListener('document:click', ['$event'])
    clickDocument(evt: MouseEvent) {
      if(this.btnsAcaoElem.map(er => er.nativeElement).some(btn => btn.contains(evt.target as Element))) return;

      this.menuItem = undefined;
    }

    getLarguras(config: TiraListaCol<T>[], nivel : number, temFilhos : boolean) {
      let largurasList = [];

      for(let _ of [].constructor(nivel)){
        largurasList.push(LARGURA_FUNC);
      }

      if(temFilhos) largurasList.push(LARGURA_FUNC);

      largurasList.push(...config.map(c => c.largura));

      return  largurasList.join(' ');
    }


    getColConfig() : string {
      return this.lista?.[0].config.map(c => c.largura).join(' ')
    }

    abrirItem(item: TiraRecord<T>, evt: MouseEvent) {

      if(
        this.btnsAcaoElem.map(elemRef => elemRef.nativeElement).some(elem => elem.contains(evt.target as Element))
        || this.AcaoElem.map(elemRef => elemRef.nativeElement).some(elem => elem.contains(evt.target as Element))
      )
        return;
     

      this.clickFunc(item);

      

    }


}


