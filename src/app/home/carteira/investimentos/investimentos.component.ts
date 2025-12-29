import { Component, OnInit } from '@angular/core';
import { IContaLista } from '../../../utils/interfaces/conta-lista.interface';
import { HttpClient } from '@angular/common/http';
import { CampoPesquisaComponent } from "../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { CommonModule } from '@angular/common';
import { TiraListaComponent } from "../../../utils/components/tira-lista/tira-lista.component";
import { TiraListaCol, TiraRecord } from '../../../utils/components/tira-lista/TiraListaConfig';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { InvestimentosService } from '../../../utils/services/investimentos.service';
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";
import { finalize, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PermissaoService } from '../../../utils/services/permissao.service';
import { IPodeDTO } from '../../../utils/models/PodeDto';
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-investimentos',
  templateUrl: './investimentos.component.html',
  styleUrls: ['./investimentos.component.scss'],
  imports: [CommonModule, CampoPesquisaComponent, TiraListaComponent, FaIconComponent, ProgressModalComponent, FormsModule, BarraPaginacaoComponent]
})
export class InvestimentosComponent implements OnInit {

  investimentos : TiraRecord<IContaLista>[];
  qtInvestimentos : number = 0;
  term : string;
  numPag = 1;

  carregando = false;

  faIconPlus = faPlus;

  abrirInvestimento = (record: TiraRecord<IContaLista>) => {
    this.router.navigate([record.dado.id], {relativeTo: this.activeRoute})
  }

  constructor(
    private investimentoSrv: InvestimentosService,
    private permissaoSrv: PermissaoService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { 

  }

  ngOnInit() {
    this.recarregarLista();
  }

  recarregarLista(term?: string, pagNum?: number) {
    term = term ?? this.term;
    pagNum = pagNum ?? this.numPag;

    this.carregando = true
    
    this.permissaoSrv.getPermissao('carteirainvestimentos')
    .pipe(switchMap(({ verTodasUnidades }) => this.investimentoSrv.getLista(term, verTodasUnidades, pagNum - 1, 15)))
    .pipe(finalize(() => this.carregando = false))
    .subscribe(dados => {
      this.investimentos = this.gerarRecord(dados.data);
      this.qtInvestimentos = dados.ammount;
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
