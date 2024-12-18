import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { GrupoDTO } from "../../../utils/models/GrupoDTO";
import { GrupoService } from "../../../utils/services/grupo.service";
import { ProfileService } from "../../../utils/services/profile.service";
import { tap } from "rxjs";

@Component({
    standalone: true,
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
        this.profileService.getUserWithAvatar().pipe(tap(
            user => {
                this.grupoService.findByUsuario(user.id).pipe(tap(
                    grupos => {
                        this.grupos = grupos
                    }
                )).subscribe();
            }
        )).subscribe();
    }



}