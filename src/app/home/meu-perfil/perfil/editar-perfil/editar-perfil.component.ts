import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable, ReplaySubject } from "rxjs";
import { IProfile } from "../../../../utils/interfaces/profile.interface";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { ProfileService } from "../../../../utils/services/profile.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faWrench } from "@fortawesome/free-solid-svg-icons";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'spo-meuperfil-perfil-editar',
    standalone: true,
    templateUrl: './editar-perfil.component.html',
    styleUrl: './editar-perfil.component.scss',
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule]
})
export class EditarPerfilComponent implements AfterViewInit{

    faSalvarIcon = faFloppyDisk

    user : IProfile = {
        imgPerfil: null,
        id: null,
        sub: '',
        name: 'Fulano de Tal',
        email: 'fulano@email.com',
        telefone: '(27) 9 9846-2992',
        role: [{id:"", nome: 'Diretor'}],
        token: 'ddd'
    }

    form = new FormGroup({
        inNome: new FormControl(''),
        inNomeCompleto: new FormControl(''),
        inEmail: new FormControl(''),
        inTelefone: new FormControl('')
    });

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService
    ){}

    ngAfterViewInit(): void {
        
        this.profileService.getUser().subscribe(user => {
            
            this.user = user;
            this.loadUser();
            
        })

        this.dataUtilService.editModeListener.next(true);

    }

    loadUser(){
        
        this.form.get("inNome").setValue(this.user.name.split(' ')[0]);
        this.form.get("inNomeCompleto").setValue(this.user.name);
        this.form.get("inEmail").setValue(this.user.email);
        this.form.get("inTelefone").setValue(this.user.telefone);
    }
}