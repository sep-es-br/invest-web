import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ObjetosFiltroComponent } from "./objetos-filtro/objetos-filtro.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ObjetoTiraDTO } from "../../../../utils/models/ObjetoTiraDTO";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { merge, tap } from "rxjs";
import { ObjetoFiltro } from "../../../../utils/models/ObjetoFiltro";
import { TiraObjetoComponent } from "./tira-objetos/tira-objeto.component";
import { BarraPaginacaoComponent } from "../../../../utils/components/barra-paginacao/barra-paginacao.component";
import { IObjetoFiltro } from "../../../../utils/interfaces/objetoFiltro.interface";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { IPodeDTO } from "../../../../utils/models/PodeDto";

@Component({
    standalone: true,
    templateUrl: "./objetos-listagem.component.html",
    styleUrl: "./objetos-listagem.component.scss",
    imports: [
        CommonModule, ObjetosFiltroComponent, FontAwesomeModule, 
        ReactiveFormsModule, TiraObjetoComponent, BarraPaginacaoComponent,
        RouterModule
    ]
})
export class ObjetosListagemComponent implements AfterViewInit{

    searchIcon = faMagnifyingGlass;
    novoObjIcon = faFileLines;
    
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    qtObjetos = 0;

    filtro : IObjetoFiltro = {};

    objetos : ObjetoTiraDTO[] = [];

    txtBusca = new FormControl("");

    pode : IPodeDTO
    
    larguraPaginacao = 7;
    qtPorPagina = 15;

    paginaAtual = 1;

    constructor(
        private objService : ObjetosService,
        private router : Router,
        private route : ActivatedRoute,
        private toastr : ToastrService,
        private permissaoService : PermissaoService
    ){}


    ngAfterViewInit(): void {   
        this.txtBusca.valueChanges.pipe(tap(value => {
            this.recarregarLista(this.paginaAtual)
        })).subscribe();

        this.permissaoService.getPermissao("carteiraobjetos").subscribe(pode => {
            this.pode = pode;
        });
    }

    updateFiltro(novoFiltro : IObjetoFiltro) {
        this.filtro = novoFiltro;
        this.recarregarLista(this.paginaAtual);
    }

    redirectTo(path : string) {
        if(!this.pode.visualizar) return;

        this.router.navigate([path], {relativeTo: this.route})
    }

    removerObjeto(objeto : ObjetoTiraDTO) {
        this.objService.removerObjeto(objeto.id).pipe(
            tap(obj => {
                this.toastr.success("Objeto Removido!");
                this.recarregarLista(this.paginaAtual);
            })
        ).subscribe()
    }

    recarregarLista(novaPagina : number) {

        this.paginaAtual = novaPagina;
        
        this.filtro.nome = this.txtBusca.value;

        
        merge(
            this.objService.getListaTiraObjetos(this.filtro, this.paginaAtual, this.qtPorPagina).pipe(tap(
                objetos => this.objetos = objetos
            )),
            this.objService.getQuantidadeItens(this.filtro).pipe(tap(
                qtObjetos => {
                    this.qtObjetos = qtObjetos;
                    this.barraPaginacaoComponent.updatePaginacao(qtObjetos); 
                }
            ))
        ).subscribe();
    }


}