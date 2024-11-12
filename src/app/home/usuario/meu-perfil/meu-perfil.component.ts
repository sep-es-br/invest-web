import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IProfile } from "../../../utils/interfaces/profile.interface";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { DomSanitizer } from "@angular/platform-browser";
import { DataUtilService } from "../../../utils/services/data-util.service";
import { ProfileService } from "../../../utils/services/profile.service";

@Component({
    selector: 'spo-meu-perfil',
    templateUrl: './meu-perfil.component.html',
    styleUrl: './meu-perfil.component.scss',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class MeuPerfilComponent implements AfterViewInit{

    avatarPlaceHolderUrl = 'assets/img/placeholderUserM.webp';
    avatarUser : any | null = null;

    user : IProfile = {
        imgPerfil: null,
        sub: '',
        name: 'Fulano de Tal',
        email: 'fulano@email.com',
        cpf: '000.000.000-00',
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

    }

    loadUser(){

        if(this.user.imgPerfil && this.user.imgPerfil.blob !== "")
            this.avatarUser = this.dataUtilService.imageFromBase64(String(this.user.imgPerfil.blob));
        
        this.form.get("inNome").setValue(this.user.name);
        this.form.get("inEmail").setValue(this.user.email);
    }

    salvar() {
        if(this.user.imgPerfil) {
            this.user.imgPerfil.blob = this.form.get("avatar").value
        } else {
            this.user.imgPerfil = {
                id: null,
                blob: this.form.get("avatar").value
            }
        }
        
        this.user.name = this.form.get("inNome").value;
        this.user.email = this.form.get("inEmail").value;
        
        this.profileService.salvarUsuario(this.user).subscribe(user => {
            if(user)
                alert("usuario salvo com sucesso")
            else
                alert("erro ao salvar usuario")
        })
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0]; // Here we use only the first file (single file)

        this.convertFile(file).subscribe(base64 => {
            this.form.get("avatar").setValue(base64);
            this.avatarUser =  this.dataUtilService.imageFromBase64(base64)
            console.log(base64)
          });

        
      }
    
      convertFile(file : File) : Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => result.next(event.target.result.toString().split(',')[1]);
        return result;
      }
}   