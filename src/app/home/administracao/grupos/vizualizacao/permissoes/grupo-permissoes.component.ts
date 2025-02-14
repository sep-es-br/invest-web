import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { GrupoDTO } from "../../../../../utils/models/GrupoDTO";
import { IModuloDTO } from "../../../../../utils/models/ModuloDto";
import { ModuloService } from "../../../../../utils/services/modulo.service";
import { concat, merge, tap } from "rxjs";
import { GrupoService } from "../../../../../utils/services/grupo.service";
import { ModuloConfigComponent } from "./modulo-config/modulo-config.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { IPodeDTO } from "../../../../../utils/models/PodeDto";
import { PermissaoService } from "../../../../../utils/services/permissao.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
    standalone: true,
    templateUrl: "./grupo-permissoes.component.html",
    styleUrl: "./grupo-permissoes.component.scss",
    imports: [CommonModule, ModuloConfigComponent, FontAwesomeModule, ReactiveFormsModule]
})
export class GrupoPermissoesComponent implements OnInit {
    
    @ViewChildren(ModuloConfigComponent) modulosConfig : QueryList<ModuloConfigComponent>

    salvarIcon = faFloppyDisk;

    grupo : GrupoDTO;
    modulos : IModuloDTO[]

    permissao : IPodeDTO;

    verTodasUnidadesFormControl = new FormControl(false);


    constructor(
        private moduloService : ModuloService, 
        private grupoService : GrupoService,
        private permissaoService : PermissaoService,
        private toastr : ToastrService
    ) {
        this.grupoService.grupoSession.pipe(tap( grupo => {
            this.grupo = grupo;

            if(!grupo) return

            this.verTodasUnidadesFormControl.setValue(grupo.podeVerTodasUnidades);

            concat(
                this.moduloService.findAll().pipe(tap( moduloList => {
                    this.modulos = moduloList;
                })),
                this.permissaoService.getPermissao('grupo').pipe(tap( 
                    permissao => {
                        this.permissao = permissao;
                        if(permissao.editar) {
                            this.verTodasUnidadesFormControl.enable({onlySelf: true});
                        } else {
                            this.verTodasUnidadesFormControl.disable({onlySelf: true});
                        }
                    }
                 ))
            ).subscribe();

        })).subscribe()
    }

    testar(event : any) {
        console.log(typeof event)
    }

    ngOnInit(): void {
        
        
        
    }

    salvar() {
        const permissoes : IPodeDTO[] = [];

        this.modulosConfig.forEach(moduloConfig => {
            permissoes.push(...moduloConfig.gerarPermissoes())
        })


        this.grupo.permissoes = permissoes;
        this.grupo.podeVerTodasUnidades = this.verTodasUnidadesFormControl.value


        this.grupoService.save(this.grupo).subscribe(grupo => {
            this.grupoService.grupoSession.next(grupo);
            this.permissaoService.updateMenuSignal.next(null);
            this.toastr.success("Grupo Salvo!!");
        })

    }

}