import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { IFluxo } from "../../../../utils/interfaces/fluxo.interface";
import { FormsModule } from "@angular/forms";
import { faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { GrupoService } from "../../../../utils/services/grupo.service";
import { tap } from "rxjs";

@Component({
    standalone: true,
    templateUrl: "./fluxo-cadastro.component.html",
    styleUrl: "./fluxo-cadastro.component.scss",
    imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class FluxoCadastroComponent implements AfterViewInit {

    addEtapaIcon = faPlusCircle;
    removerEtapaIcon = faXmarkCircle;

    standaloneNgModelOption = {
        standalone: true
    }

    fluxo : IFluxo = {
        nome: "",
        etapas: []
    };

    gruposList : GrupoDTO[];

    constructor(
        private grupoService : GrupoService
    ){
        this.addEtapa()
    }

    ngAfterViewInit(): void {
        this.grupoService.findAllBy(undefined)
        .pipe(
            tap(grupoList => this.setGruposList(grupoList))
        ).subscribe();
    }

    setGruposList(grupoList : GrupoDTO[]) {
        this.gruposList = grupoList
    }

    addEtapa() {
        this.fluxo.etapas.push({
            nome: "",
            etapaId: undefined,
            grupoResponsavel: undefined,
            acoes: []
        });
    }

}