import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvestimentosService } from '../../../../utils/services/investimentos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin, map, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { IContaDetail, IObjetoTiraSimples } from '../../../../utils/interfaces/conta-detail.interface';
import { CommonModule } from '@angular/common';
import { ProgressModalComponent } from "../../../../utils/components/progress-modal/progress-modal.component";
import { PermissaoService } from '../../../../utils/services/permissao.service';
import { IPodeDTO } from '../../../../utils/models/PodeDto';
import { faEye, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { UnidadeOrcamentariaDTO } from '../../../../utils/models/UnidadeOrcamentariaDTO';
import { PlanoOrcamentarioDTO } from '../../../../utils/models/PlanoOrcamentarioDTO';
import { UnidadeOrcamentariaService } from '../../../../utils/services/unidadeOrcamentaria.service';
import { PlanoOrcamentarioService } from '../../../../utils/services/planoOrcamentario.service';
import { DataUtilService } from '../../../../utils/services/data-util.service';
import { TiraListaComponent } from "../../../../utils/components/tira-lista/tira-lista.component";
import { TiraListaCol, TiraRecord } from '../../../../utils/components/tira-lista/TiraListaConfig';

@Component({
  selector: 'app-investimento-detail',
  imports: [CommonModule, ProgressModalComponent, FaIconComponent, TiraListaComponent],
  templateUrl: './investimento-detail.component.html',
  styleUrl: './investimento-detail.component.scss'
})
export class InvestimentoDetailComponent implements OnInit, OnDestroy {

  $destroy = new Subject<void>();
  
  editIcon = faPencil;
  addIcon = faPlus;

  conta : IContaDetail;
  carregando = false;
  permissao : IPodeDTO;

  listObjetos : TiraRecord<IObjetoTiraSimples>[];

  unidade : UnidadeOrcamentariaDTO;
  planoOrcamentario : PlanoOrcamentarioDTO;

  constructor(
    private investimentoSrv: InvestimentosService,
    private activatedRoute: ActivatedRoute,
    private permissaoSrv: PermissaoService,
    private unidadeSrv: UnidadeOrcamentariaService,
    private planoSrv: PlanoOrcamentarioService,
    private dataUtil: DataUtilService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.carregarConta()
  }

  carregarConta(){
    this.carregando = true;
    forkJoin({
      conta: this.activatedRoute.params.pipe(
              take(1),
              switchMap(({id}) => this.investimentoSrv.getDetail(id)),
              ),
      permissao: this.permissaoSrv.getPermissao('carteirainvestimentos')
    
    })
    .pipe(
      switchMap(({conta, permissao}) => forkJoin({
        conta: of(conta),
        permissao: of(permissao),
        unidade: this.unidadeSrv.getByCodigo(conta.codUnidade),
        planoOrcamentario: this.planoSrv.getByCodigo(conta.codPO)
      })),
      finalize(() => this.carregando = false)
    )
    .subscribe({
      next: ({conta, permissao, unidade, planoOrcamentario}) => {
        this.conta = conta;

        this.dataUtil.setTitleInfo("id", (conta.nome.length > 50) ? conta.nome.substring(0, 50) + "..." : conta.nome)

        this.listObjetos = conta.objetos
        .map((obj) => {
          
          let custoReduzido = Object.values(obj.custos)
                  .flatMap(value => Object.values(value))
                  .reduce((acc, vlr) => ({planejado: acc.planejado + vlr.planejado, contratado: acc.contratado + vlr.contratado}))

          return {
            id: obj.id,
            nome: obj.nome,
            planejado: custoReduzido.planejado,
            contratado: custoReduzido.contratado
          } as IObjetoTiraSimples
        })
        .map(
          (obj) => new TiraRecord<IObjetoTiraSimples>({
            dado: obj,
            config: [
              new TiraListaCol<IObjetoTiraSimples>({
                titulo: 'Objeto', caminhoValor: 'nome', tipo: 'propLongo', largura: '5fr'
              }),
              
             new TiraListaCol<IObjetoTiraSimples>({
              titulo: 'Planejado', caminhoValor: 'planejado', tipo: 'propDinheiro'
            } ),
             new TiraListaCol<IObjetoTiraSimples>({
              titulo: 'Contratado', caminhoValor: 'contratado', tipo: 'propDinheiro'
            } ),
             new TiraListaCol<IObjetoTiraSimples>({
              tipo: 'botao', opcoes: [
                {
                  icon: faEye, 
                  label: 'Vizualizar', 
                  acao: (evt, data) => this.router.navigate(['../../objetos', data.id], {relativeTo: this.activatedRoute}) 
                }
                ]
            } )]
          })  
        )

        this.permissao = permissao;
        this.unidade = unidade;
        this.planoOrcamentario = planoOrcamentario;
      }
    })
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  abrirEditar(){
    this.router.navigate(['editar'], {relativeTo: this.activatedRoute});
  }

}
