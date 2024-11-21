import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IProfile } from "../../utils/interfaces/profile.interface";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { DomSanitizer } from "@angular/platform-browser";
import { DataUtilService } from "../../utils/services/data-util.service";
import { ProfileService } from "../../utils/services/profile.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'spo-meu-perfil',
    templateUrl: './meu-perfil.component.html',
    styleUrl: './meu-perfil.component.scss',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule]
})
export class MeuPerfilComponent implements AfterViewInit{

    avatarPlaceHolderUrl = 'assets/img/placeholderUserM.webp';
    avatarUser : any | null = null;

    faEditarImg = faPencil;
    faRemover = faXmark;
    
    editarImg : boolean;

    user : IProfile = {
        imgPerfil: null,
        id: null,
        sub: '',
        name: 'Fulano',
        nomeCompleto: 'Fulano de Tal',
        email: 'fulano@email.com',
        telefone: '(27) 9 9846-9229',
        role: [{id:"", nome: 'Diretor'}],
        token: 'ddd'
    }

    form = new FormGroup({
        avatar: new FormControl(null),
        inNome: new FormControl(""),
        inEmail: new FormControl("")
    })

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService
    ){}

    ngAfterViewInit(): void {
        
        this.profileService.getUserWithAvatar().subscribe(user => {
            
            this.user = user;
            this.loadUser();
            
        })

        this.dataUtilService.editModeListener.subscribe(mode => this.editarImg = mode)

    }

    loadUser(){

        if(this.user.imgPerfil && this.user.imgPerfil.blob !== "")
            this.avatarUser = this.dataUtilService.imageFromBase64(String(this.user.imgPerfil.blob));
        
    }

    removerImg() {
        this.avatarUser = null;
        this.user.imgPerfil = null;

        this.salvarUser()

    }

    alterarImg(event : Event) {
         const file = (event.target as HTMLInputElement).files[0];
         
         if(file == null) return;

         this.convertFile(file).subscribe(base64 => {
            this.avatarUser = this.dataUtilService.imageFromBase64(base64);

            if(this.user.imgPerfil) {
                this.user.imgPerfil.blob = this.form.get("avatar").value
            } else {
                this.user.imgPerfil = {
                    id: null,
                    blob: base64
                }
            }

            this.salvarUser();

         })
    }

    salvarUser() {
        this.profileService.salvarUsuario(this.user).subscribe(user => {
            if(user){
                this.profileService.userListener.next(this.user)
            } else
                alert("erro ao salvar usuario")
        })
    }


    convertFile(file : File) : Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => result.next(event.target.result.toString().split(',')[1]);
        return result;
      }

}   