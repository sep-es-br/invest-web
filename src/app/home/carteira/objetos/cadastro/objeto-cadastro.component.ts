import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
    standalone: true,
    templateUrl: "./objeto-cadastro.component.html",
    styleUrl: "./objeto-cadastro.component.scss",
    imports: [CommonModule, ReactiveFormsModule]
})
export class ObjetoCadastroComponent {


    objetoCadastro = new FormGroup({
        tipo: new FormControl(null),
        nome: new FormControl(null),
        descricao: new FormControl(null),
        unidade: new FormControl(null),
        programaOrcamentario: new FormControl(null),
        microregiaoAtendida: new FormControl(null),
        infoComplementares: new FormControl(null),
        chkObjContratado: new FormControl(null),
        chkAudienciaPublica: new FormControl(null),
        chkEstrategica: new FormControl(null),
        chkCti: new FormControl(null),
        chkClimatica: new FormControl(null),
        chkPip: new FormControl(null),
        chkCusteioAnual: new FormControl(null)
    });

    



}