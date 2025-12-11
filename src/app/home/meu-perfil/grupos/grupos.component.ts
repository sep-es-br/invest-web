import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { GrupoDTO } from "../../../utils/models/GrupoDTO";
import { GrupoService } from "../../../utils/services/grupo.service";
import { ProfileService } from "../../../utils/services/profile.service";
import { tap } from "rxjs";

@Component({
    templateUrl: "./grupos.component.html",
    styleUrl: "./grupos.component.scss",
    imports: [CommonModule]
})
export class MeuPerfilGruposComponent {

    grupos : GrupoDTO[]

    constructor(
        private grupoService : GrupoService, 
        private profileService : ProfileService
    ){


        
        this.grupoService.findByUsuario(this.profileService.displayUser$().id).pipe(tap(
            grupos => {
                this.grupos = grupos
            }
        )).subscribe();
     
    }



}