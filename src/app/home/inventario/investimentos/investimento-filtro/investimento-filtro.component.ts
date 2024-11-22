import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosComponent } from "../investimentos.component";
import { InfosService } from "../../../../utils/services/infos.service";
import { Router } from "@angular/router";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";

@Component({
    selector: 'spo-investimento-filtro',
    templateUrl: './investimento-filtro.component.html',
    styleUrl: './investimento-filtro.component.scss',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class InvestimentoFiltroComponent {
    
    anos : string[];
    planos : PlanoOrcamentarioDTO[];
    unidades : UnidadeOrcamentariaDTO[];

    form = new FormGroup({
        unidadeOrcamentariaControl: new FormControl(null),
        planoOrcamentarioControl: new FormControl(null),
        exercicio: new FormControl(null)
    });

    constructor(private infosService: InfosService,
                private planoService: PlanoOrcamentarioService,
                private unidadeService: UnidadeOrcamentariaService
    ) {
        this.infosService.getAllAnos().subscribe((anosList) => {
                this.anos = anosList

                this.form.get("exercicio").setValue(this.anos[0]);

            });

        this.planoService.getAllPlanos().subscribe((planoList) => {
                this.planos = planoList;

            });

        this.unidadeService.getAllUnidadesOrcamentarias().subscribe((unidadeList) => {
                this.unidades = unidadeList;

            });
        
    }

    padStr(number : number, numDigits: number) : string{
        return (number < 0 ? '-':'') 
          + ((new Array(numDigits + 1).join("0"))
          + Math.abs(number)).slice(-numDigits);
      }

}