import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";

@Component({
    standalone: true,
    templateUrl: "./grupo-resumo.component.html",
    styleUrl: "./grupo-resumo.component.scss",
    imports: [CommonModule]
})
export class GrupoResumoComponent {
    @Input() data : GrupoDTO;
}