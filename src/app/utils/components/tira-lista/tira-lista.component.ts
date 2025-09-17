import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, HostBinding, Input, OnChanges, QueryList, SimpleChanges, TemplateRef, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { CustomCurrencyPipe } from '../../pipes/customCurrency.pipe';
import { NumeroResumidoPipe } from '../../pipes/numero-resumido.pipe';

@Component({
  selector: 'spo-tira-lista',
  imports: [CommonModule, FontAwesomeModule, CustomCurrencyPipe, NumeroResumidoPipe],
  templateUrl: './tira-lista.component.html',
  styleUrl: './tira-lista.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TiraListaComponent<T> implements OnChanges, AfterContentInit{
    
    @ContentChild('details', {read: TemplateRef}) details: TemplateRef<{$implicit: T, index: number}>;

    @Input() lista : T[];
    @Input() config : TiraListaConfig[];

    estados: boolean[] = [];
  
    toggleSeta = faAngleRight;
    acoesIcon = faEllipsis;

    ngAfterContentInit(): void {
      console.log(this.details);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.estados = new Array<boolean>((changes['lista']?.currentValue?.length ?? 0));
    }

    get larguraDasColunas(){
      return this.config.map(c => c.largura).join(' ');
    }

}

export class TiraListaConfig {
    titulo?: string;
    caminhoValor?: string;
    largura?:string = "fit-content";
    tipo?: "propriedade" | "propLongo" | "propDinheiro" | "toggle" | 'acao' = "propriedade"
    opcoes?: {
      icon?: IconDefinition, 
      label: string,
      acao: (evt:any) => void
    }[];

    constructor(init: Partial<TiraListaConfig>) {
      Object.assign(this, init);
    }

    getValue(obj : any) {

      let out = obj;
      
      for(let loc of this.caminhoValor.split('.')) {
        out = out?.[loc]
      }

      return out;

    }
}
