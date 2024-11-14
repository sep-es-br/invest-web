import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { InvestimentoFiltroComponent } from "./investimento-filtro/investimento-filtro.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosService } from "../../../utils/services/investimentos.service";
import { RouterLink } from "@angular/router";
import { InvestimentoDTO } from "../../../utils/models/InvestimentoDTO";
import { TiraInvestimentoComponent } from "../../../utils/components/tira-investimento/tira-investimento.component";
import { InvestimentoFiltro } from "../../../utils/models/InvestimentoFiltro";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ValorCardComponent } from "../../../utils/components/valor-card/valor-card.component";
import { DataUtilService } from "../../../utils/services/data-util.service";
import { CustoService } from "../../../utils/services/custo.service";
import { ObjetosService } from "../../../utils/services/objetos.service";
import { BarraPaginacaoComponent } from "../../../utils/components/barra-paginacao/barra-paginacao.component";

@Component({
    selector: 'spo-investimentos',
    templateUrl: './investimentos.component.html',
    styleUrl: './investimentos.component.scss',
    standalone: true,
    imports: [
        CommonModule, TiraInvestimentoComponent, RouterLink,
        ReactiveFormsModule, InvestimentoFiltroComponent, 
        FontAwesomeModule, ValorCardComponent, BarraPaginacaoComponent
    ]
})
export class InvestimentosComponent implements AfterViewInit {

    searchIcon = faMagnifyingGlass;

    @ViewChild(InvestimentoFiltroComponent) filtroComponent! : InvestimentoFiltroComponent;
    @ViewChild(BarraPaginacaoComponent) barraPaginacaoComponent : BarraPaginacaoComponent;

    totalPrevisto : number = 0;
    totalHomologado : number = 0;
    totalAutorizado : number = 0;
    totalDisponivel : number = 0;

    filtro : InvestimentoFiltro = { qtPorPag: 15, numPag: 1 };

    txtBusca = new FormControl('');

    data : InvestimentoDTO[] = [];
    qtObjetos = 0;

    qtInvestimento = 0;
    larguraPaginacao = 7;
    qtPorPagina = 15;

    constructor( 
        private service: InvestimentosService,
        private custoService: CustoService,
        private objetoService: ObjetosService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.updateFiltro(1) )
        this.filtroComponent.form.valueChanges.subscribe(value => this.updateFiltro(1))

    }

    updateFiltro(novaPagina : number){

        this.filtro = {
            exercicio: this.filtroComponent.form.get("exercicio").value,
            codPO: this.filtroComponent.form.get("planoOrcamentarioControl").value,
            codUnidade: this.filtroComponent.form.get("unidadeOrcamentariaControl").value,
            nome: this.txtBusca.value,
            numPag: novaPagina,
            qtPorPag: 15
        }

        this.recarregarLista(novaPagina);
    }


    recarregarLista(novaPagina : number) {

        this.filtro.numPag = novaPagina;

        this.custoService.getTotalPrevisto(this.filtro.exercicio).subscribe(totalPrevisto => {
            this.totalPrevisto = totalPrevisto;
        })

        this.custoService.getTotalHomologado(this.filtro.exercicio).subscribe(totalContratado => {
            this.totalHomologado = totalContratado
        })

        this.service.getListaInvestimentos(this.filtro).subscribe(invs => {
            this.data = invs;
        });

        this.service.getQuantidadeItens(this.filtro).subscribe(quantidade => {
            this.qtInvestimento = quantidade
            this.barraPaginacaoComponent.updatePaginacao(quantidade);  
        })
        

        this.objetoService.getQuantidadeItens(this.filtro).subscribe(quantidade => {
            this.qtObjetos = quantidade;
        })
       
    }
}