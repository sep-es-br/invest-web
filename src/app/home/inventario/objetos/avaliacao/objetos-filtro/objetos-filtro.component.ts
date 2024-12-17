import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InfosService } from "../../../../../utils/services/infos.service";
import { UnidadeOrcamentariaService } from "../../../../../utils/services/unidadeOrcamentaria.service";
import { UnidadeOrcamentariaDTO } from "../../../../../utils/models/UnidadeOrcamentariaDTO";

@Component({
    selector: 'spo-objeto-filtro',
    templateUrl: './objetos-filtro.component.html',
    styleUrl: './objetos-filtro.component.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class ObjetoFiltroComponent implements AfterViewInit {
    
    form = new FormGroup({
        unidadeOrcamentariaControl: new FormControl(null),
        statusControl: new FormControl(null),
        exercicio: new FormControl(null)
    })

    anos : number[];
    unidades : UnidadeOrcamentariaDTO[];


    constructor(private infoService : InfosService,
                private unidadeService : UnidadeOrcamentariaService
    ){

    }

    ngAfterViewInit(): void {
        this.infoService.getAllAnos().subscribe(anosList => {
            this.anos = anosList;

            this.form.get('exercicio').setValue(this.anos[0]);
        });

        this.unidadeService.getAllUnidadesOrcamentarias().subscribe(unidadeList => {
            this.unidades = unidadeList;
        });
    }


}