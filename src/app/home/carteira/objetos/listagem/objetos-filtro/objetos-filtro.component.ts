import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import { DropdownFiltroComponent } from "../../../../../utils/components/dropdown-filtro/dropdown-filtro.component";
import { IObjetoFiltro } from "../../../../../utils/interfaces/objetoFiltro.interface";
import { UnidadeOrcamentariaDTO } from "../../../../../utils/models/UnidadeOrcamentariaDTO";
import { UnidadeOrcamentariaService } from "../../../../../utils/services/unidadeOrcamentaria.service";
import { finalize, merge, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { PlanoOrcamentarioDTO } from "../../../../../utils/models/PlanoOrcamentarioDTO";
import { InfosService } from "../../../../../utils/services/infos.service";
import { PlanoOrcamentarioService } from "../../../../../utils/services/planoOrcamentario.service";

@Component({
    selector: "spo-objetos-filtro",
    standalone: true,
    templateUrl: "./objetos-filtro.component.html",
    styleUrl: "./objetos-filtro.component.scss",
    imports: [CommonModule, DropdownFiltroComponent]
})
export class ObjetosFiltroComponent implements AfterViewInit {

    filtro : IObjetoFiltro = {}

    @Output() public filterChange = new EventEmitter<IObjetoFiltro>();


    unidades : UnidadeOrcamentariaDTO[];
    anos : number[];
    planos : PlanoOrcamentarioDTO[];

    constructor(
        private infosService: InfosService,
        private planoService: PlanoOrcamentarioService,
        private unidadeService: UnidadeOrcamentariaService
    ){}

    update() {

        this.filterChange.emit(this.filtro);
    }

    ngAfterViewInit(): void {

         merge(
            this.infosService.getAllAnos()
            .pipe(tap((anosList) => {
                this.anos = anosList;

                this.filtro.exercicio = new Date().getFullYear();

            })),

            this.planoService.getAllPlanos()
            .pipe(tap((planoList) => {
                this.planos = planoList;
            })),

            this.unidadeService.getAllUnidadesOrcamentarias()
            .pipe(tap((unidadeList) => {

                this.unidades = unidadeList;
                
            }))
        ).pipe(finalize(() => this.update())).subscribe()
                
    }

}