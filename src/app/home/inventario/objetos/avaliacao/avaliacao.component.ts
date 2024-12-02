import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { ObjetoFiltroComponent } from "./objetos-filtro/objetos-filtro.component";
import { ObjetoDTO } from "../../../../utils/models/ObjetoDTO";
import { TiraObjetoComponent } from "../../../../utils/components/tira-objeto/tira-objeto.component";
import { ObjetoFiltro } from "../../../../utils/models/ObjetoFiltro";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { BarraPaginacaoComponent } from "../../../../utils/components/barra-paginacao/barra-paginacao.component";

@Component({
    selector: "spo-avaliacao",
    templateUrl: "./avaliacao.component.html",
    styleUrl: "./avaliacao.component.scss",
    standalone: true,
    imports: [
    CommonModule, ReactiveFormsModule, ObjetoFiltroComponent,
    TiraObjetoComponent, FontAwesomeModule,
    BarraPaginacaoComponent
]
})
export class AvaliacaoComponent implements AfterViewInit{

    searchIcon = faMagnifyingGlass;

    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;
    @ViewChild(ObjetoFiltroComponent) private filtroComponent : ObjetoFiltroComponent;
    txtBusca = new FormControl('');

    data : ObjetoDTO[] = [];

    filtro : ObjetoFiltro;

    paginaAtual = 1;

    qtObjetos = 0;
    larguraPaginacao = 7;

    constructor(private service: ObjetosService,
            private dataUtilService : DataUtilService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.recarregarLista(this.paginaAtual));
        this.filtroComponent.form.valueChanges.subscribe(value => this.recarregarLista(this.paginaAtual));
        
    }

    updateFiltro(){

        this.filtro = {
            exercicio: this.filtroComponent.form.get("exercicio").value,
            unidadeId: this.filtroComponent.form.get("unidadeOrcamentariaControl").value,
            status: this.filtroComponent.form.get("statusControl").value,
            nome: this.txtBusca.value
        };
    }

    recarregarLista(novaPagina : number) {

        this.updateFiltro()

        this.paginaAtual = novaPagina;

        this.service.getListaObjetos(this.filtro, novaPagina, 15).subscribe(invs => {
            this.data = invs;
        });

        this.service.getQuantidadeItens(this.filtro).subscribe(quantidade => {
            this.qtObjetos = quantidade
            this.barraPaginacaoComponent.updatePaginacao(quantidade);  
        })
       
    }

    voltaUmaPagina() {
        if(this.paginaAtual > 1)
            this.paginaAtual--
    }

    avancarUmaPagina() {
        if(this.paginaAtual < this.data.length)
            this.paginaAtual++
    }
}