import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, effect, signal, WritableSignal } from "@angular/core";
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

@Component({
    selector: 'spo-meuperfil-perfil-editar',
    templateUrl: './editar-perfil.component.html',
    styleUrl: './editar-perfil.component.scss',
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule]
})
export class EditarPerfilComponent implements AfterViewInit{

    faSalvarIcon = faFloppyDisk

    userSignal : WritableSignal<IProfile> = signal(undefined) ;

    form = new FormGroup({
        nome: new FormControl(''),
        nomeCompleto: new FormControl(''),
        email: new FormControl(''),
        telefone: new FormControl('')
    });

    constructor(private dataUtilService : DataUtilService,
            private profileService : ProfileService,
            private router: Router,
            private toastr : ToastrService
    ){}

    ngAfterViewInit(): void {
                
        setTimeout(() => {
            this.userSignal = this.profileService.displayUser$;
            this.loadUser();
        }); 


        this.dataUtilService.editModeListener.next(true);

    }

    loadUser(){
        
        const {name, nomeCompleto, email, telefone} = this.userSignal();

        this.form.patchValue({
            nome: name,
            nomeCompleto,
            email,
            telefone
        })

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

    salvarUser() {

        const {sub, imgPerfil} = this.userSignal();

        const salvarUsuarioForm = {
            ...this.form.value,
            sub,
            avatar: imgPerfil?.blob
        }

        this.profileService.salvarUsuario(salvarUsuarioForm).subscribe({
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