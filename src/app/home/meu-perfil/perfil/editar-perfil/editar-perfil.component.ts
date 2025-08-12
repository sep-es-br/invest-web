import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, effect } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { map, Observable, ReplaySubject, switchMap } from "rxjs";
import { IProfile } from "../../../../utils/interfaces/profile.interface";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { ProfileService } from "../../../../utils/services/profile.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faWrench } from "@fortawesome/free-solid-svg-icons";
import { Router, RouterModule } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IPapelDTO } from "../../../../utils/models/PapelDto";
import { ErrorHandlerService } from "../../../../utils/services/error-handler.service";

@Component({
    selector: 'spo-meuperfil-perfil-editar',
    templateUrl: './editar-perfil.component.html',
    styleUrl: './editar-perfil.component.scss',
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule]
})
export class EditarPerfilComponent implements AfterViewInit{

    faSalvarIcon = faFloppyDisk

    user : IProfile;

    form = new FormGroup({
        inNome: new FormControl(''),
        inNomeCompleto: new FormControl(''),
        inEmail: new FormControl(''),
        inTelefone: new FormControl('')
    });

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService,
            private router: Router,
            private toastr : ToastrService
    ){}

    ngAfterViewInit(): void {
        
        effect(() => {
            this.user = this.profileService.sessionProfile$();
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

    getPapelUser() : IPapelDTO{
        
        if(this.user.papeis?.length === 1)
            return this.user.papeis[0]
        else
            return this.user.papeis?.find(p => p.prioritario)
    }

    salvarUser() {
        const { inNome, inNomeCompleto, inEmail, inTelefone } = this.form.value;

        const newUser = {
                    ...this.user,
                    name: inNome,
                    nomeCompleto: inNomeCompleto,
                    email: inEmail,
                    telefone: inTelefone
                }

        this.profileService.salvarUsuario(newUser).subscribe({
            next: novoUser => {
                if(novoUser) {
                    this.profileService.sessionProfile$.set(novoUser);
                    this.toastr.success("Usuario salvo")
                    this.router.navigateByUrl("/home/meuperfil/detalhe");
                } else {
                    this.toastr.error("Erro ao salvar usuario");
                }
            }
        });
        

    }

}