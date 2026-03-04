import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressModalComponent } from "../../../../utils/components/progress-modal/progress-modal.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, MaxLengthValidator, NgForm, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IContaDetail, IObjetoTiraSimples } from '../../../../utils/interfaces/conta-detail.interface';
import { UnidadeOrcamentariaDTO } from '../../../../utils/models/UnidadeOrcamentariaDTO';
import { cleanApoc } from '../../../../utils/funcoes-util';
import { PlanoOrcamentarioDTO } from '../../../../utils/models/PlanoOrcamentarioDTO';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faEye, faFloppyDisk, faPencil, faPlusCircle, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { catchError, combineLatest, filter, finalize, forkJoin, Observable, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { InvestimentosService } from '../../../../utils/services/investimentos.service';
import { UnidadeOrcamentariaService } from '../../../../utils/services/unidadeOrcamentaria.service';
import { PlanoOrcamentarioService } from '../../../../utils/services/planoOrcamentario.service';
import { DataUtilService } from '../../../../utils/services/data-util.service';
import { TiraListaComponent } from "../../../../utils/components/tira-lista/tira-lista.component";
import { TiraListaCol, TiraRecord } from '../../../../utils/components/tira-lista/TiraListaConfig';
import { CadastroInvestimentoService } from '../../../../utils/services/cadastro-investimento.service';
import { PermissaoService } from '../../../../utils/services/permissao.service';
import { IPodeDTO } from '../../../../utils/models/PodeDto';
import { ToastrService } from 'ngx-toastr';
import { OverlayDirective } from "../../../../utils/directive/overlay.directive";
import { IDoUnload } from '../../../../utils/guard/DoUnload.interface';

@Component({
  selector: 'app-investimento-cadastro',
  imports: [
    CommonModule,
    ProgressModalComponent,
    NgSelectModule,
    FaIconComponent,
    TiraListaComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    OverlayDirective
],
  templateUrl: './investimento-cadastro.component.html',
  styleUrl: './investimento-cadastro.component.scss'
})
export class InvestimentoCadastroComponent implements OnInit, OnDestroy {

  $destroy = new Subject<void>();

  addIcon = faPlusCircle;
  salvarIcon = faFloppyDisk;
    faIconX = faXmark;

  checado = false;
  carregamento = false;
  listUnidades : UnidadeOrcamentariaDTO[];
  listPlanosOrcamentarios : PlanoOrcamentarioDTO[];

  listObjetos : TiraRecord<IObjetoTiraSimples>[];

  objARemover : IObjetoTiraSimples;

  permissaoObjeto : IPodeDTO;

  existePar = undefined;

  get parUsado() {
    return !!this.existePar && this.existePar !== this.cadastroInvestimentoService.investimento?.id
  }

  form : FormGroup;
  novo = true;


  constructor(
    private activeRoute : ActivatedRoute,
    private investimentoSrv : InvestimentosService,
    private unidadeSrv : UnidadeOrcamentariaService,
    private planoOrcamentarioSrv : PlanoOrcamentarioService,
    private dataUtilSrv : DataUtilService,
    private cadastroInvestimentoService: CadastroInvestimentoService,
    private fb: FormBuilder, 
    private router: Router,
    private toaster : ToastrService,
    private permissaoService: PermissaoService
  ){
    this.form = this.fb.group({
      tipo: this.fb.control({value: 'Investimento', disabled: true}, [Validators.required]) ,
      nome: this.fb.control(undefined, [Validators.required, Validators.maxLength(140)]),
      descricao: this.fb.control(undefined, [Validators.required, Validators.maxLength(280)]) ,
      codUnidade: this.fb.control(undefined, [Validators.required]),
      codPO: this.fb.control(undefined, [Validators.required])
    });

    this.form.valueChanges.subscribe(value => this.cadastroInvestimentoService.patchValueInvestimento(value));
    this.cadastroInvestimentoService.investimentoObs.subscribe(value => this.form.patchValue(value, {emitEvent: false}));

    const controlCodUnidade = this.form.controls['codUnidade'];
    const controlCodPO = this.form.controls['codPO'];

    combineLatest([
      controlCodUnidade.valueChanges.pipe(startWith(controlCodUnidade.value)),
      controlCodPO.valueChanges.pipe(startWith(controlCodPO.value))
    ]).pipe(switchMap(
      ([codUnidade, codPo]) => this.investimentoSrv.checarValor(codPo, codUnidade)
    )).subscribe(existe => this.existePar = existe)
  }

  ngOnInit(): void {
    this.carregamento = true;

    this.activeRoute.params
    .pipe(
      switchMap(({id}) => forkJoin({
        permissaoObjeto: this.permissaoService.getPermissao('carteiraobjetos'),
        conta: id ? 
              this.investimentoSrv.getDetail(id) :
              of(this.cadastroInvestimentoService.investimento),
        unidades: this.unidadeSrv.getFromSigefes(),
        planosOrcamentarios: this.planoOrcamentarioSrv.getDoSigefes(undefined)
      })),
      tap(() => this.carregamento = false),
      catchError((err) => {
        this.carregamento = false;
        return err;
      })
    )
    .subscribe({
    next: ({permissaoObjeto, conta, unidades, planosOrcamentarios}) => {
      this.permissaoObjeto = permissaoObjeto;
      this.novo = !conta.id;
      if(!this.cadastroInvestimentoService.investimento)
        this.cadastroInvestimentoService.investimento = conta;

      if(this.cadastroInvestimentoService.investimento.id) 
        this.dataUtilSrv.setTitleInfo("id", this.cadastroInvestimentoService.investimento.nome.length > 50 
          ? `${this.cadastroInvestimentoService.investimento.nome.substring(0, 50)}...` 
          : this.cadastroInvestimentoService.investimento.nome)

      this.loadObjetos(this.cadastroInvestimentoService.investimento.objetos?.map((obj) => {
        
        let custoReduzido = Object.values(obj.custos)
                .flatMap(value => Object.values(value))
                .reduce((acc, vlr) => ({planejado: (acc.planejado ?? 0) + (vlr?.planejado ?? 0), contratado: (acc.contratado ?? 0) + (vlr?.contratado ?? 0)}))

        return {
          id: obj.id,
          nome: obj.nome,
          planejado: custoReduzido.planejado,
          contratado: custoReduzido.contratado
        } as IObjetoTiraSimples
      }));
      this.listUnidades = unidades;
      this.listPlanosOrcamentarios = planosOrcamentarios
    }
  })


  
  }


  excluirObjeto() {
    this.carregamento = true;
    this.cadastroInvestimentoService.removerObjeto(this.listObjetos?.findIndex((obj) => obj.dado.id === this.objARemover.id) ).then(() => {
      this.loadObjetos(this.cadastroInvestimentoService.investimento.objetos?.map((obj) => {

        let custoReduzido = Object.values(obj.custos)
                .flatMap(value => Object.values(value))
                .reduce((acc, vlr) => ({planejado: (acc.planejado ?? 0) + (vlr?.planejado ?? 0), contratado: (acc.contratado ?? 0) + (vlr?.contratado ?? 0)}))

        return {
          id: obj.id,
          nome: obj.nome,
          planejado: custoReduzido.planejado,
          contratado: custoReduzido.contratado
        } as IObjetoTiraSimples
      }));
    }).finally(() => {
      this.carregamento = false;
      this.objARemover = undefined;
    });
  }

  loadObjetos(objs: IObjetoTiraSimples[]) {
    if(!objs) return;

    this.listObjetos = objs.map(
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
              titulo: 'Contratado', caminhoValor: 'contratado', tipo: 'propDinheiro', valorDefault: 0
            } ),
             new TiraListaCol<IObjetoTiraSimples>({
              tipo: 'botao', opcoes: [
                ...( this.permissaoObjeto.editar
                      ? [{
                          icon: faPencil, 
                          label: 'Alterar', 
                          acao: (evt: MouseEvent, data: IObjetoTiraSimples, index: number) => {

                            this.cadastroInvestimentoService.objAtivo = index;
                            this.router.navigate(['objeto'], {relativeTo: this.activeRoute})
                            
                          }
                        }]
                      : []
                ),
                ...( this.permissaoObjeto.excluir
                    ? [{
                        icon: faTrash, 
                        label: 'Remover', 
                        tipo: 'negativo' as const,
                        acao: (evt: MouseEvent, data: IObjetoTiraSimples, index: number) => {
                          
                          this.objARemover = data;
                        }
                      }]
                    : []
                )                
                ]
            } )]
          })  
        ) as TiraRecord<IObjetoTiraSimples>[];
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete;
  }

  filtrarUnidades(term : string, item : UnidadeOrcamentariaDTO) : boolean {
      return cleanApoc(item.sigla).includes(cleanApoc(term)) || item.codigo.includes(term);
  }

  filtrarPlanoOrcamentario(term : string, item : PlanoOrcamentarioDTO) : boolean {
      return cleanApoc(item.nome).includes(cleanApoc(term)) || item.codigo.includes(term);
  }

  async salvar(){
    this.checado = true;
    if(this.form.invalid){
      this.toaster.error('Favor preencher os campos obrigatórios', 'ATENÇÃO');
      return;
    }

      


    this.carregamento = true;
    (await this.cadastroInvestimentoService.salvar(
      this.listPlanosOrcamentarios.find(plano => plano.codigo === this.cadastroInvestimentoService.investimento.codPO),
      this.listUnidades.find(unidade => unidade.codigo === this.cadastroInvestimentoService.investimento.codUnidade)
    ))
    .pipe(finalize(() => this.carregamento = false))
    .subscribe(conta => {
            this.cadastroInvestimentoService.investimento = conta;
            this.router.navigate(['..'], {relativeTo: this.activeRoute})
        });;
  }

  addObjeto()  {
    const novoIndex = this.cadastroInvestimentoService.addNovoObjeto();
    this.cadastroInvestimentoService.objAtivo = novoIndex;
    this.router.navigate(['objeto'], {relativeTo: this.activeRoute})
  }

  getUnidade(cod: string) : UnidadeOrcamentariaDTO {
    return this.listUnidades?.find(unidade => unidade.codigo === cod)
  }

  getPlanoOrcamentario(cod: string) : PlanoOrcamentarioDTO {
    console.log(cod)
    return this.listPlanosOrcamentarios?.find(unidade => unidade.codigo === cod)
  }

  limparInvestimentoENavegar() {
    this.cadastroInvestimentoService.investimento = undefined;
    const routeConf = this.activeRoute.parent.routeConfig;
    if(routeConf.path === 'novo') {
      this.router.navigate([`../${this.existePar}/editar`], {relativeTo: this.activeRoute}) ;
    } else {
      this.router.navigate([`../../${this.existePar}/editar`], {relativeTo: this.activeRoute}) ;
    }
  }

  

}
