import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { ObjetoFiltroComponent } from "./objetos-filtro/objetos-filtro.component";
import { ObjetoDTO } from "../../../../utils/models/ObjetoDTO";
import { TiraObjetoComponent } from "../../../../utils/components/tira-objeto/tira-objeto.component";
import { ObjetoFiltroDTO } from "../../../../utils/models/ObjetoFiltroDTO";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { DataUtilService } from "../../../../utils/services/data-util.service";

@Component({
    selector: "spo-avaliacao",
    templateUrl: "./avaliacao.component.html",
    styleUrl: "./avaliacao.component.scss",
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, ObjetoFiltroComponent,
        TiraObjetoComponent, FontAwesomeModule
    ]
})
export class AvaliacaoComponent implements AfterViewInit{

    searchIcon = faMagnifyingGlass;

    @ViewChild(ObjetoFiltroComponent) private filtroComponent : ObjetoFiltroComponent;
    txtBusca = new FormControl('');

    data : ObjetoDTO[][] = [];

    filtro : ObjetoFiltroDTO;

    paginaAtual = 1;

    qtObjetos = 0;

    constructor(private service: ObjetosService,
            private dataUtilService : DataUtilService
    ) {
        
    }

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(value => this.updateFiltro());
        this.filtroComponent.form.valueChanges.subscribe(value => this.updateFiltro());
        
    }

    updateFiltro(){

        this.filtro = {
            exercicio: this.filtroComponent.form.get("exercicio").value,
            unidadeId: this.filtroComponent.form.get("unidadeOrcamentariaControl").value,
            status: this.filtroComponent.form.get("statusControl").value,
            nome: this.txtBusca.value
        };

        this.service.getListaObjetos(this.filtro).subscribe((objs) => {
            this.data = this.dataUtilService.paginar(objs, 15);

            this.qtObjetos = objs.length;

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