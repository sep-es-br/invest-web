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
import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { FonteOrcamentariaService } from "../../../../utils/services/fonteOrcamentaria.service";
import { merge, tap } from "rxjs";

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
    fontes : FonteOrcamentariaDTO[];

    form = new FormGroup({
        unidadeOrcamentariaControl: new FormControl(null),
        planoOrcamentarioControl: new FormControl(null),
        fonteOrcamentariaControl: new FormControl(null),
        exercicio: new FormControl(null)
    });

    constructor(private infosService: InfosService,
                private planoService: PlanoOrcamentarioService,
                private unidadeService: UnidadeOrcamentariaService,
                private fonteService : FonteOrcamentariaService
    ) {

        merge(
            this.infosService.getAllAnos()
            .pipe(tap((anosList) => {
                this.anos = anosList

                const anoAtual = new Date().getFullYear().toString();
                this.form.get("exercicio").setValue(anoAtual);

            })),

            this.planoService.getAllPlanos()
            .pipe(tap((planoList) => this.planos = planoList)),

            this.unidadeService.getAllUnidadesOrcamentarias()
            .pipe(tap((unidadeList) => this.unidades = unidadeList)),

            this.fonteService.findAll()
            .pipe(tap((fonteList) => this.fontes = fonteList))
        ).subscribe()
        
    }
    

    padStr(number : number, numDigits: number) : string{
        return (number < 0 ? '-':'') 
          + ((new Array(numDigits + 1).join("0"))
          + Math.abs(number)).slice(-numDigits);
      }

}