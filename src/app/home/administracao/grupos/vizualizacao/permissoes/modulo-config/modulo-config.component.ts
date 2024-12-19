import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { GrupoDTO } from "../../../../../../utils/models/GrupoDTO";
import { IModuloDTO } from "../../../../../../utils/models/ModuloDto";
import { IPodeDTO } from "../../../../../../utils/models/PodeDto";
import { PermissaoService } from "../../../../../../utils/services/permissao.service";
import { concat, merge, pipe, tap } from "rxjs";

@Component({
    selector: "spo-modulo-config",
    standalone: true,
    templateUrl: "./modulo-config.component.html",
    styleUrl: "./modulo-config.component.scss",
    imports: [CommonModule, ReactiveFormsModule]
})
export class ModuloConfigComponent implements AfterViewInit {

    @ViewChildren(ModuloConfigComponent) modulosFilhosQuery : QueryList<ModuloConfigComponent>

    @Input() grupo : GrupoDTO;
    @Input() modulo : IModuloDTO;

    permissaoId : string = null;


    form = new FormGroup({
        inListar: new FormControl(false),
        inVisualizar: new FormControl(false),
        inCriar: new FormControl(false),
        inEditar: new FormControl(false),
        inExcluir: new FormControl(false)
    });

    permissaoGrupo : IPodeDTO;

    constructor(
        private permissaoService : PermissaoService
    ){}

    ngAfterViewInit(): void {

        this.subscribePropagacao("inListar");
        this.subscribePropagacao("inVisualizar");
        this.subscribePropagacao("inCriar");
        this.subscribePropagacao("inEditar");
        this.subscribePropagacao("inExcluir");

        merge(
            this.permissaoService.findByModuloGrupo(this.modulo.id, this.grupo.id)
            .pipe(tap(permissao => {
                if(permissao){

                    this.permissaoId = permissao.id;
                    this.form.setValue({
                        inListar: permissao.listar,
                        inVisualizar: permissao.visualizar,
                        inCriar: permissao.criar,
                        inEditar: permissao.editar,
                        inExcluir: permissao.excluir
                    });
                }
                this.permissaoService.getPermissao('grupo').pipe(tap(
                    permissao => {
                        if(!permissao?.editar)
                            this.form.disable();
                    }
                )).subscribe()
            })),
            
        )
        .subscribe();
        
    }

    subscribePropagacao(controlName : string) {
        this.form.get(controlName).valueChanges.subscribe(value => {
            this.modulosFilhosQuery.forEach(moduloFilho => {
                moduloFilho.form.get(controlName).setValue(value);
                if(value)
                    moduloFilho.form.get(controlName).disable({onlySelf: true});
                else
                    moduloFilho.form.get(controlName).enable({onlySelf: true});
            })
        })
    }

    

    gerarPermissoes() : IPodeDTO[] {
        const out : IPodeDTO[] = [];
        
        if(this.isPreenchido()){
            const formValue = this.form.getRawValue();

            out.push({
                id: this.permissaoId,
                modulo: this.modulo,
                listar: formValue.inListar,
                visualizar: formValue.inVisualizar,
                criar: formValue.inCriar,
                editar: formValue.inEditar,
                excluir: formValue.inExcluir
            });
        }

        this.modulosFilhosQuery.forEach(moduloFilho => {
            out.push(...moduloFilho.gerarPermissoes());
        })

        return out;
    }

    isPreenchido() {
        const value = this.form.getRawValue();

        return value.inListar
            || value.inVisualizar
            || value.inCriar
            || value.inEditar
            || value.inExcluir;
    }


}