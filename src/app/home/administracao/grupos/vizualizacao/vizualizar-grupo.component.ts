import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TelaCrudComponent } from "../../../../utils/components/vizualizacao-template/telaCrud-template/telaCrud.component";
import { vizualizarGrupoConfig } from "./TelaGrupo";
import { GrupoService } from "../../../../utils/services/grupo.service";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { ActivatedRoute } from "@angular/router";
import { DataUtilService } from "../../../../utils/services/data-util.service";

@Component({
    standalone: true,
    template: '<spo-tela-crud [telaConfig]="telaConfig" [data]="grupo"></spo-tela-crud>',
    imports: [CommonModule, TelaCrudComponent]
})
export class VizualizarGrupoComponent implements OnInit, OnDestroy{

    telaConfig = vizualizarGrupoConfig;

    grupo : GrupoDTO

    constructor(private grupoService : GrupoService,
        private route: ActivatedRoute, private dataUtil : DataUtilService
    ){}

    carregarGrupo(grupoId : string) {
        this.grupoService.findById(grupoId).subscribe(grupo => {
            this.grupo = grupo;
            this.dataUtil.obsNomeTela.next(grupo.sigla)
        })
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.carregarGrupo(params["id"])
        })
    }

    ngOnDestroy(): void {
        this.dataUtil.obsNomeTela.next(null);
    }

}