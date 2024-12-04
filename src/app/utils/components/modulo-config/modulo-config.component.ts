import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { GrupoDTO } from "../../models/GrupoDTO";
import { IModuloDTO } from "../../models/ModuloDto";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "spo-modulo-config",
    standalone: true,
    templateUrl: "./modulo-config.component.html",
    styleUrl: "./modulo-config.component.scss",
    imports: [CommonModule, ReactiveFormsModule]
})
export class ModuloConfigComponent {

    @Input() grupo : GrupoDTO;
    @Input() modulo : IModuloDTO;

    form = new FormGroup({
        inListar: new FormControl(true),
        inVisualizar: new FormControl(true),
        inCriar: new FormControl(true),
        inEditar: new FormControl(true),
        inExcluir: new FormControl(true)
    });
}