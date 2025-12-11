import { Component, OnDestroy, OnInit } from '@angular/core';
import { TiraListaComponent } from "../../../utils/components/tira-lista/tira-lista.component";
import { ProfileService } from '../../../utils/services/profile.service';
import { ProgressModalComponent } from "../../../utils/components/progress-modal/progress-modal.component";
import { BehaviorSubject, debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { IUsuarioResponse } from '../../../utils/interfaces/usuarioResponse.interface';
import { TiraListaCol, TiraRecord } from '../../../utils/components/tira-lista/TiraListaConfig';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { CampoPesquisaComponent } from "../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { IDataList } from '../../../utils/interfaces/dataList.interface';
import { avatarPadrao } from '../../../utils/interfaces/avatar.interface';
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";
import { ActivatedRoute, Router } from '@angular/router';
import { PermissaoService } from '../../../utils/services/permissao.service';
import { IPodeDTO } from '../../../utils/models/PodeDto';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss'],
  imports: [TiraListaComponent, ProgressModalComponent, FormsModule, CampoPesquisaComponent, BarraPaginacaoComponent]
})
export class PessoasComponent implements OnInit, OnDestroy {

  pessoasList : TiraRecord<IUsuarioResponse>[] = [];
  qtPessoas : number = 0;
  showProgress = false;
  termo : string;
  pgSize = 15;
  pgNumber = 0;

  searchObs$ = new Subject<{term: string, pg: number}>();
  $destroy = new Subject<void>();
  permissao : IPodeDTO

  constructor(
    private usuarioSrv: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private permissaoSrv: PermissaoService
  ) { }

  ngOnInit() {
    
    this.searchObs$.pipe(takeUntil(this.$destroy), debounceTime(500)).subscribe(search => this.doSearch(search.term, search.pg));
    
    this.permissaoSrv.getPermissao("administracaopessoas").subscribe({
      next: (permissao => this.permissao = permissao)
    })
   
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  doSearch(term?: string, pgNumber?: number) {
    this.termo = term ?? this.termo;
    this.pgNumber = pgNumber ?? this.pgNumber;

    this.showProgress = true;
    this.usuarioSrv.getAllUser(this.pgNumber, this.pgSize, this.termo)
    .pipe(finalize(() => this.showProgress = false))
    .subscribe({
      next: (value) => {
        this.buildList(value)
      }
    })
  }

  buildList(resp: IDataList<IUsuarioResponse>) {

    let config = [
      new TiraListaCol<IUsuarioResponse>({caminhoValor: 'avatarBlob', tipo: 'avatar', valorDefault: avatarPadrao}),
      new TiraListaCol<IUsuarioResponse>({titulo:'Nome', caminhoValor: 'nome', tipo: 'propLongo', largura: '2fr'}),
      new TiraListaCol<IUsuarioResponse>({titulo:'Email', caminhoValor: 'email', valorDefault: '-'}),
      new TiraListaCol<IUsuarioResponse>({titulo:'Orgão', caminhoValor: 'orgao', valorDefault: '-'})
    ];

    if(this.permissao.visualizar || this.permissao.excluir ) {
      let opcoes = [];

      if(this.permissao.visualizar) {
        opcoes.push(
          {icon: faEye, label: 'Vizualizar', acao: (evt, data) => {
            this.navegarParaPessoa(data.id)
          }}
        );
      }
      if(this.permissao.excluir) {
        opcoes.push(
          {icon: faTrash, label: 'Remover', tipo: 'negativo', acao: (evt, data) => {
            console.log('remover ' + data.id)
          }}
        )
      }


      config.push(new TiraListaCol<IUsuarioResponse>({tipo: 'botao', opcoes: opcoes})) 
    }

    this.pessoasList = resp.data.map((user) => new TiraRecord<IUsuarioResponse>({
      dado: user,
      config: config
    }))
    this.qtPessoas = resp.ammount;

  }

  navegarParaPessoa(id: number){
    this.router.navigate([id], {relativeTo: this.route})
  }

  clickFunc = (item: TiraRecord<IUsuarioResponse>) => {
        this.navegarParaPessoa(item.dado.id);
    }

}
