import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";

@Component({
    standalone: true,
    templateUrl: "./grupo-permissoes.component.html",
    styleUrl: "./grupo-permissoes.component.scss",
    imports: [CommonModule]
})
export class GrupoPermissoesComponent {
    @Input() data : GrupoDTO
}