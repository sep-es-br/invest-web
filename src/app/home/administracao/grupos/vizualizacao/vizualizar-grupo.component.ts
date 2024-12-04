import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { GrupoService } from "../../../../utils/services/grupo.service";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { GrupoResumoComponent } from "./resumo/grupo-resumo.component";
import { GrupoMembrosComponent } from "./membros/grupo-membros.component";

@Component({
    standalone: true,
    templateUrl: './vizualizar-grupo.component.html',
    styleUrl: "./vizualizar-grupo.component.scss",
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet]
})
export class VizualizarGrupoComponent implements OnInit, OnDestroy{

    grupo : GrupoDTO

    constructor(private grupoService : GrupoService,
        private route: ActivatedRoute, private dataUtil : DataUtilService
    ){}

    carregarGrupo(grupoId : string) {
        this.grupoService.findById(grupoId).subscribe(grupo => {
            this.grupo = grupo;
            this.grupoService.grupoSession.next(grupo);
            this.dataUtil.setTitleInfo('grupo', grupo.sigla)


            this.dataUtil.obsNomeTela.next(grupo.sigla);

            this.grupoService.grupoSession.subscribe(grupo => {
                this.grupo = grupo;
                this.dataUtil.obsNomeTela.next(grupo.sigla)
            })
        })

        
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.carregarGrupo(params["grupo"])
        })
    }

    ngOnDestroy(): void {
        this.dataUtil.obsNomeTela.next(null);
    }

}