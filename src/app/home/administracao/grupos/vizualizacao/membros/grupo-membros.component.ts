import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { GrupoMembroCadastroComponent } from "./grupo-membro-cadastro/grupo-membro-cadastro.component";
import { IProfile } from "../../../../../utils/interfaces/profile.interface";
import { ICadastroMembroForm } from "./grupo-membro-cadastro/CadastroMembroForm";
import { GrupoService } from "../../../../../utils/services/grupo.service";
import { ProfileService } from "../../../../../utils/services/profile.service";
import { avatarPadrao } from "../../../../../utils/interfaces/avatar.interface";

@Component({
    selector: "spo-grupo-resumo",
    standalone: true,
    templateUrl: "./grupo-membros.component.html",
    styleUrl: "./grupo-membros.component.scss",
    imports: [CommonModule,ReactiveFormsModule, FontAwesomeModule, GrupoMembroCadastroComponent]
})
export class GrupoMembrosComponent implements AfterViewInit {

    @ViewChild(GrupoMembroCadastroComponent, {read: ElementRef}) private cadastroMembro : ElementRef;

    grupo : GrupoDTO;

    searchIcon = faMagnifyingGlass;
    addMembroIcon = faUserPlus;

    txtBusca = new FormControl('');

    qtMembros = 0;
    
    membros : IProfile[] = [];

    mostrarCadastro = false;

    constructor(private service : GrupoService, private usuarioService: ProfileService){
        this.service.grupoSession.subscribe(grupoSession => {
            this.grupo = grupoSession;
            console.log(grupoSession);
        });
    }

    getAvatar(usuario : IProfile){
        return usuario.imgPerfil == null ? avatarPadrao : usuario.imgPerfil.blob;
    }

    ngAfterViewInit(): void {
        // this.usuarioService.findByGrupo(this.data.id).subscribe(membros => {
        //     this.membros = membros;
        // });
    }

    esconderModal(membroForm : ICadastroMembroForm) {
        this.mostrarCadastro = false;

        if(membroForm) {
            membroForm.grupo = this.grupo;

            this.service.addMembro(membroForm).subscribe(value => {
                alert("Membro Salvo");
            });
        }
    }
    
}