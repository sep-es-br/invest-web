import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnChanges, QueryList, SimpleChanges, TemplateRef, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'spo-tira-lista',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './tira-lista.component.html',
  styleUrl: './tira-lista.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TiraListaComponent implements OnChanges{
    
    @ViewChildren('detail', {read: TemplateRef}) details = QueryList<TemplateRef<any>>

    @Input() lista : any[];
    @Input() config : TiraListaConfig[];

    estados: boolean[] = [];
  
    toggleSeta = faAngleRight;
    acoesIcon = faEllipsis;

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
