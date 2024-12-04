import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";
import { ModuloConfigComponent } from "../../../../../utils/components/modulo-config/modulo-config.component";
import { IModuloDTO } from "../../../../../utils/models/ModuloDto";
import { ModuloService } from "../../../../../utils/services/modulo.service";
import { concat, merge, tap } from "rxjs";
import { GrupoService } from "../../../../../utils/services/grupo.service";

@Component({
    standalone: true,
    templateUrl: "./grupo-permissoes.component.html",
    styleUrl: "./grupo-permissoes.component.scss",
    imports: [CommonModule, ModuloConfigComponent]
})
export class GrupoPermissoesComponent implements OnInit {
    
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

}