import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Signal, WritableSignal } from "@angular/core";
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
import { ToastrService } from "ngx-toastr";
import { IPapelDTO } from "../../utils/models/PapelDto";
import { AVATAR_PLACEHOLDER_URL } from "../../utils/sessionLocalItems.const";

@Component({
    selector: 'spo-meu-perfil',
    templateUrl: './meu-perfil.component.html',
    styleUrl: './meu-perfil.component.scss',
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule]
})
export class MeuPerfilComponent implements AfterViewInit{

    avatarUser : any | null = null;

    faEditarImg = faPencil;
    faRemover = faXmark;
    
    editarImg : boolean;

    user : IProfile;
    userSignal : WritableSignal<IProfile>;

    form = new FormGroup({
        avatar: new FormControl(null),
        inNome: new FormControl(""),
        inEmail: new FormControl("")
    })

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService,
            private toastr : ToastrService,
            private route : ActivatedRoute
    ){}

    ngAfterViewInit(): void {
        
        this.userSignal = this.profileService.displayUser$;

        this.route.data.subscribe(({user} : {user: IProfile}) => {
            this.userSignal.set(user);
        })

        this.dataUtilService.editModeListener.subscribe(mode => this.editarImg = mode)

    }

    get imgAvatar() {
        const {imgPerfil} = this.userSignal();

        return (imgPerfil && imgPerfil.blob !== '') 
            ? this.dataUtilService.imageFromBase64(String(imgPerfil.blob)) 
            : AVATAR_PLACEHOLDER_URL;
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
                this.user.imgPerfil.blob = base64
            } else {
                this.user.imgPerfil = {
                    id: null,
                    blob: base64
                }
            }

            this.salvarUser();

         })
    }
        
    getPapelUser() : IPapelDTO{
        if(!this.user) return undefined;

        if(this.user.papeis){
            if(this.user.papeis.length === 1)
                return this.user.papeis[0]
            else
                return this.user.papeis.find(p => p.prioritario)
        } else {
            return {
                id: undefined,
                nome: this.user.papel,
                agenteNome: undefined,
                agenteSub: undefined,
                guid: undefined,
                prioritario: undefined,
                setor: this.user.setor
            }
        }
    }

    salvarUser() {
        this.profileService.salvarUsuario(this.user).subscribe(user => {
            if(user){
                this.profileService.sessionProfile$.set(this.user)
                this.toastr.success("Usuário salvo com sucesso");
            } else
                this.toastr.error("erro ao salvar usuario");
        })
    }


    convertFile(file : File) : Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => result.next(event.target.result.toString());
        return result;
      }

}   