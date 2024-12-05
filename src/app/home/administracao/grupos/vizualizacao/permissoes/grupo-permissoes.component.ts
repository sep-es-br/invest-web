import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";
import { IModuloDTO } from "../../../../../utils/models/ModuloDto";
import { ModuloService } from "../../../../../utils/services/modulo.service";
import { concat, merge, tap } from "rxjs";
import { GrupoService } from "../../../../../utils/services/grupo.service";
import { ModuloConfigComponent } from "./modulo-config/modulo-config.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { IPodeDTO } from "../../../../../utils/models/PodeDto";

@Component({
    standalone: true,
    templateUrl: "./grupo-permissoes.component.html",
    styleUrl: "./grupo-permissoes.component.scss",
    imports: [CommonModule, ModuloConfigComponent, FontAwesomeModule]
})
export class GrupoPermissoesComponent implements OnInit {
    
    @ViewChildren(ModuloConfigComponent) modulosConfig : QueryList<ModuloConfigComponent>

    salvarIcon = faFloppyDisk;

    grupo : GrupoDTO;
    modulos : IModuloDTO[]


    constructor(private moduloService : ModuloService, private grupoService : GrupoService) {
        this.grupoService.grupoSession.pipe(tap( grupo => {
            this.grupo = grupo;
        })).subscribe()
    }

    ngOnInit(): void {
        
        this.moduloService.findAll().pipe(tap( moduloList => {
            this.modulos = moduloList;
        })).subscribe();
    }

    salvar() {
        const permissoes : IPodeDTO[] = [];

        this.modulosConfig.forEach(moduloConfig => {
            permissoes.push(...moduloConfig.gerarPermissoes())
        })

        this.grupo.permissoes = permissoes;

        this.grupoService.save(this.grupo).subscribe(grupo => {
            this.grupoService.grupoSession.next(grupo);
            alert("Grupo Salvo!!");
        })

    }

}