import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosService } from "../../../utils/services/investimentos.service";
import { RouterLink } from "@angular/router";
import { InvestimentoDTO } from "../../../utils/models/InvestimentoDTO";
import { TiraInvestimentoComponent } from "../../../utils/components/tira-investimento/tira-investimento.component";
import { InvestimentoFiltroDTO } from "../../../utils/models/InvestimentoFiltroDTO";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";
import { DataUtilService } from "../../../utils/services/data-util.service";

@Component({
    selector: 'spo-investimentos',
    templateUrl: './investimentos.component.html',
    styleUrl: './investimentos.component.scss',
    standalone: true,
    imports: [
        CommonModule, TiraInvestimentoComponent, RouterLink,
        ReactiveFormsModule, InvestimentoFiltroComponent, 
        FontAwesomeModule, ValorCardComponent
    ]
})
export class InvestimentosComponent implements AfterViewInit {

    searchIcon = faMagnifyingGlass;

    @ViewChild(InvestimentoFiltroComponent) filtroComponent! : InvestimentoFiltroComponent;

    totalPrevisto : number;
    totalHomologado : number;
    totalAutorizado : number;
    totalDisponivel : number;

    filtro : InvestimentoFiltroDTO = { };

    txtBusca = new FormControl('');

    data : InvestimentoDTO[][] = [];
    qtObjetos = 0;
    qtInvestimento = 0;

    paginaAtual = 1;

    constructor( 
        private service: InvestimentosService,
        private dataUtilService : DataUtilService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.updateFiltro() )
        this.filtroComponent.form.valueChanges.subscribe(value => this.updateFiltro())

    }

    updateFiltro(){

        this.filtro = {
            exercicio: this.filtroComponent.form.get("exercicio").value,
            codPO: this.filtroComponent.form.get("planoOrcamentarioControl").value,
            codUnidade: this.filtroComponent.form.get("unidadeOrcamentariaControl").value,
            nome: this.txtBusca.value
        }

        this.recarregarLista();
    }

    recarregarLista() {

        this.totalPrevisto = 0;
        this.totalHomologado = 0;
        this.totalAutorizado = 0;
        this.totalDisponivel = 0;

        this.qtObjetos = 0;

        this.service.getListaInvestimentos(this.filtro).subscribe(invs => {
            this.data = this.dataUtilService.paginar(invs, 15);
            this.qtInvestimento = invs.length;

            invs.forEach(inv => {
                this.totalPrevisto += inv.totalPrevisto;
                this.totalHomologado += inv.totalHomologado;
                this.totalAutorizado += inv.totalAutorizado;
                this.totalDisponivel += inv.totalDisponivel;

                this.qtObjetos += inv.objetos.length
            })                

        });
       
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