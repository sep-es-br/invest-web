import { Component, OnInit } from '@angular/core';
import { IContaLista } from '../../../utils/interfaces/conta-lista.interface';
import { HttpClient } from '@angular/common/http';
import { CampoPesquisaComponent } from "../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { CommonModule } from '@angular/common';
import { TiraListaComponent } from "../../../utils/components/tira-lista/tira-lista.component";
import { TiraListaCol, TiraRecord } from '../../../utils/components/tira-lista/TiraListaConfig';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-investimentos',
  templateUrl: './investimentos.component.html',
  styleUrls: ['./investimentos.component.scss'],
  imports: [CommonModule, CampoPesquisaComponent, TiraListaComponent, FaIconComponent]
})
export class InvestimentosComponent implements OnInit {

  investimentos : TiraRecord<IContaLista>[];

  faIconPlus = faPlus;

  constructor(
    private http : HttpClient
  ) { 
    
    

  }

  ngOnInit() {
    this.http.get<IContaLista[]>('assets/mocks/listInvestimentos.json')
    .subscribe(dados => {
      this.investimentos = this.gerarRecord(dados) 
    })

  }

  gerarRecord(data: IContaLista[]) : TiraRecord<IContaLista>[] {
      return data
      .map(d => ({...d, unidadeOrcamentaria: `${d.codUnidade} - ${d.siglaUnidade}`}))
      .map(d => new TiraRecord({
          dado: d,
          config: [
              new TiraListaCol({ titulo: "Investimento", caminhoValor: "nome", tipo: "propLongo", largura: "5fr" }),
              new TiraListaCol({ titulo: "Unidade", caminhoValor: "unidadeOrcamentaria" }),
              new TiraListaCol({ titulo: "Código P.O", caminhoValor: "codPO" }),
              new TiraListaCol({ titulo: "Previsto", caminhoValor: "totalPrevisto", tipo: "propDinheiro" }),
              new TiraListaCol({ titulo: "Contratado", caminhoValor: "totalContratado", tipo: "propDinheiro" }),
              new TiraListaCol({ titulo: "Autorizado", caminhoValor: "totalAutorizado", tipo: "propDinheiro" }),
              new TiraListaCol({ titulo: "Empenhado", caminhoValor: "totalEmpenhado", tipo: "propDinheiro" }),
              new TiraListaCol({ titulo: "Disp. S/ Reserva", caminhoValor: "totalDisponivel", tipo: "propDinheiro" }),
          ]
      }))
  }

}
