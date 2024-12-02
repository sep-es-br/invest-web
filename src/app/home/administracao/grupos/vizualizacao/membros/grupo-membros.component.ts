import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { GrupoMembroCadastroComponent } from "./grupo-membro-cadastro/grupo-membro-cadastro.component";
import { IProfile } from "../../../../../utils/interfaces/profile.interface";

@Component({
    standalone: true,
    templateUrl: "./grupo-membros.component.html",
    styleUrl: "./grupo-membros.component.scss",
    imports: [CommonModule,ReactiveFormsModule, FontAwesomeModule, GrupoMembroCadastroComponent]
})
export class GrupoMembrosComponent {
    @Input() data : GrupoDTO

    @ViewChild(GrupoMembroCadastroComponent, {read: ElementRef}) private cadastroMembro : ElementRef;

    searchIcon = faMagnifyingGlass;
    addMembroIcon = faUserPlus;

    txtBusca = new FormControl('');

    qtMembros = 0;

    mostrarCadastro = false;

    esconderModal(usuario : IProfile) {
        this.mostrarCadastro = false;
    }
    
}