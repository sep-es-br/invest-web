import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable, ReplaySubject } from "rxjs";
import { IProfile } from "../../../../utils/interfaces/profile.interface";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { ProfileService } from "../../../../utils/services/profile.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faWrench } from "@fortawesome/free-solid-svg-icons";
import { Router, RouterModule } from "@angular/router";

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
        name: 'Fulano',
        nomeCompleto: 'Fulano de Tal',
        papel: '',
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
            private profileService : ProfileService,
            private router: Router
    ){}

    ngAfterViewInit(): void {
        
        this.profileService.getUserWithAvatar().subscribe(user => {
            
            this.user = user;
            this.loadUser();
            
        })

        this.dataUtilService.editModeListener.next(true);

    }

    loadUser(){
        
        this.form.get("inNome").setValue(this.user.name);
        this.form.get("inNomeCompleto").setValue(this.user.nomeCompleto);
        this.form.get("inEmail").setValue(this.user.email);
        this.form.get("inTelefone").setValue(this.user.telefone);
    }

    salvarUser() {

        this.profileService.getAvatarFromLoggedSub().subscribe(avatar => {
            this.user = {
                name: this.form.get("inNome").value,
                nomeCompleto: this.form.get("inNomeCompleto").value,
                email: this.form.get("inEmail").value,
                telefone: this.form.get("inTelefone").value,
                papel: this.user.papel,
                id: this.user.id,
                imgPerfil: avatar,
                role: this.user.role,
                sub: this.user.sub,
                token: this.user.token
            }
    
            this.profileService.salvarUsuario(this.user).subscribe(novoUser => {
                if(novoUser) {
                    this.profileService.userListener.next(novoUser);
                    alert("Usuario salvo")
                    this.router.navigateByUrl("/home/meuperfil/detalhe");
                } else {
                    alert("Erro ao salvar usuario")
                }
            });
    })

        

    }

}