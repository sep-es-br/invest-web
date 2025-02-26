import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { GrupoService } from "../../../../utils/services/grupo.service";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { GrupoResumoComponent } from "./resumo/grupo-resumo.component";
import { GrupoMembrosComponent } from "./membros/grupo-membros.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { GrupoCadastroComponent } from "../cadastro/grupo-cadastro.component";
import { tap } from "rxjs";

@Component({
    standalone: true,
    templateUrl: './vizualizar-grupo.component.html',
    styleUrl: "./vizualizar-grupo.component.scss",
    imports: [
    CommonModule, RouterLink, RouterLinkActive, RouterOutlet,
    FontAwesomeModule,
    GrupoCadastroComponent
]
})
export class VizualizarGrupoComponent implements OnInit, OnDestroy{

    grupo : GrupoDTO

    editarIcon = faPen;

    exibirModalEdicao = false;

    constructor(private grupoService : GrupoService,
        private route: ActivatedRoute, private dataUtil : DataUtilService
    ){}

    carregarGrupo(grupoId : string) {
        this.grupoService.findById(grupoId).subscribe(grupo => {
            // this.grupo = grupo;            
            // this.dataUtil.setTitleInfo('grupo', grupo.sigla)
            // this.dataUtil.obsNomeTela.next(grupo.sigla);
            this.grupoService.grupoSession.subscribe(grupo => {
                this.grupo = grupo;
                this.dataUtil.setTitleInfo('grupo', grupo?.sigla)
                // this.dataUtil.obsNomeTela.next(grupo.sigla)
            })
            this.grupoService.grupoSession.next(grupo);
        })

        
    }

    fecharEdicao(grupo : GrupoDTO){
        this.exibirModalEdicao = false;

        if(grupo) {
            this.grupoService.save(grupo).pipe(
                tap(grupo => this.grupoService.grupoSession.next(grupo))
            ).subscribe()
        }
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