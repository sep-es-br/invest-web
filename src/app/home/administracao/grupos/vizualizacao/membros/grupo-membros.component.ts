import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEllipsis, faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { GrupoMembroCadastroComponent } from "./grupo-membro-cadastro/grupo-membro-cadastro.component";
import { IProfile } from "../../../../../utils/interfaces/profile.interface";
import { ICadastroMembroForm } from "./grupo-membro-cadastro/CadastroMembroForm";
import { GrupoService } from "../../../../../utils/services/grupo.service";
import { ProfileService } from "../../../../../utils/services/profile.service";
import { avatarPadrao } from "../../../../../utils/interfaces/avatar.interface";
import { concat, merge, tap } from "rxjs";

@Component({
    selector: "spo-grupo-resumo",
    standalone: true,
    templateUrl: "./grupo-membros.component.html",
    styleUrl: "./grupo-membros.component.scss",
    imports: [CommonModule,ReactiveFormsModule, FontAwesomeModule, GrupoMembroCadastroComponent]
})
export class GrupoMembrosComponent implements AfterViewInit {

    @ViewChild('tabela', {read: ElementRef}) private tabelaRef : ElementRef;

    grupo : GrupoDTO;

    searchIcon = faMagnifyingGlass;
    addMembroIcon = faUserPlus;
    maisOpcs = faEllipsis;

    txtBusca = new FormControl('');

    qtMembros = 0;
    
    membros : IProfile[] = [];

    subAberto = -1;
    debounce = true;

    mostrarCadastro = false;

    @HostListener('document:click', ['$event'])
    clickout(event : MouseEvent) {
        if(this.debounce)
            this.subAberto = -1;
        else 
            this.debounce = true

    }
    

    constructor(private service : GrupoService, private usuarioService: ProfileService){
        
        this.service.grupoSession.pipe(tap(grupoSession => {
            
            this.grupo = grupoSession;
            
            if(grupoSession){
                this.service.quantidadeMembros(grupoSession.id).pipe(tap(quantidade => {
                    this.qtMembros = quantidade;
                })).subscribe()
            }
        })).subscribe()


    }

    getAvatar(usuario : IProfile){
        return usuario.imgPerfil == null ? avatarPadrao : usuario.imgPerfil.blob;
    }

    ngAfterViewInit(): void {
        // this.usuarioService.findByGrupo(this.data.id).subscribe(membros => {
        //     this.membros = membros;
        // });
    }

    mostrarSub(subMenuIndex : number){
        this.debounce = false;

        this.subAberto = subMenuIndex;
    }

    removerMembro(membroId : string){
       this.service.removerMembro(this.grupo.id, membroId).subscribe(grupo => {
            this.service.grupoSession.next(grupo);
            this.subAberto = -1;
            alert('Membro removido');
       }) 
    }

    esconderModal(membroForm : ICadastroMembroForm) {
        this.mostrarCadastro = false;

        if(membroForm) {
            membroForm.grupo = this.grupo;

            this.service.addMembro(membroForm).subscribe(value => {
                this.service.grupoSession.next(value);
                alert("Membro Salvo");
            });
        }
    }
    
}