import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tira-lista',
  imports: [],
  templateUrl: './tira-lista.component.html',
  styleUrl: './tira-lista.component.scss'
})
export class TiraListaComponent {
  @Input() lista : any[];
  @Input() config : ITiraListaConfig[];

}

export interface ITiraListaConfig {
    
}
