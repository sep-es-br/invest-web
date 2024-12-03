import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable, ReplaySubject } from "rxjs";
import { IProfile } from "../../../utils/interfaces/profile.interface";
import { DataUtilService } from "../../../utils/services/data-util.service";
import { ProfileService } from "../../../utils/services/profile.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'spo-meuperfil-perfil',
    standalone: true,
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss',
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule]
})
export class PerfilComponent implements AfterViewInit{

    faEditIcon = faWrench

    avatarPlaceHolderUrl = 'assets/img/placeholderUserM.webp';
    avatarUser : any | null = null;

    user : IProfile ;

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService
    ){}

    ngAfterViewInit(): void {
        
        this.profileService.getUserWithAvatar().subscribe(user => {
            
            this.user = user;
            // this.loadUser();
        });

        this.dataUtilService.editModeListener.next(false);

    }

    // loadUser(){
        
    //     this.form.get("inNome").setValue(this.user.name);
    //     this.form.get("inEmail").setValue(this.user.email);
    // }
}