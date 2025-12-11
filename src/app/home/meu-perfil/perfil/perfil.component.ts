import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable, ReplaySubject } from "rxjs";
import { IProfile } from "../../../utils/interfaces/profile.interface";
import { DataUtilService } from "../../../utils/services/data-util.service";
import { ProfileService } from "../../../utils/services/profile.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { RouterModule } from "@angular/router";
import { IPapelDTO } from "../../../utils/models/PapelDto";

@Component({
    selector: 'spo-meuperfil-perfil',
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss',
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule]
})
export class PerfilComponent implements AfterViewInit{

    faEditIcon = faWrench

    avatarPlaceHolderUrl = 'assets/img/placeholderUserM.webp';
    avatarUser : any | null = null;

    userSignal : WritableSignal<IProfile> = signal(undefined) ;

    editavel = false;

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService
    ){}

    ngAfterViewInit(): void {
        setTimeout(() => this.userSignal = this.profileService.displayUser$); 

        this.dataUtilService.editModeListener.next(false);

        this.editavel = this.profileService.displayUser$().sub === this.profileService.sessionProfile$().sub;

    }
    
    getPapelUser() : IPapelDTO{
        if(!this.userSignal()) return undefined;

        if(this.userSignal().papeis){
            
            let prioritario = this.userSignal().papeis.find(p => p.prioritario);

            return prioritario ?? this.userSignal().papeis[0]
            
        } else {
            return {
                id: undefined,
                nome: this.userSignal().papel,
                agenteNome: undefined,
                agenteSub: undefined,
                guid: undefined,
                prioritario: undefined,
                setor: this.userSignal().setor
            }
        }
    }

}