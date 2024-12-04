import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { IProfile } from "../../../../../../utils/interfaces/profile.interface";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../../../utils/models/UnidadeOrcamentariaDTO";
import { ISetorDTO } from "../../../../../../utils/models/SetorDTO";
import { InfosService } from "../../../../../../utils/services/infos.service";
import { IPapelDTO, papelTodos } from "../../../../../../utils/models/PapelDto";
import { ICadastroMembroForm } from "./CadastroMembroForm";
import { GrupoService } from "../../../../../../utils/services/grupo.service";

@Component({
    selector: "spo-grupo-membro-cadastro",
    standalone: true,
    templateUrl: "./grupo-membro-cadastro.component.html",
    styleUrl: "./grupo-membro-cadastro.component.scss",
    imports: [CommonModule, ReactiveFormsModule]
})
export class GrupoMembroCadastroComponent {

    @Output() onClose = new EventEmitter<ICadastroMembroForm>();

    form : FormGroup;

    unidades : UnidadeOrcamentariaDTO[] = [];
    setores : ISetorDTO[] = [];
    papeis : IPapelDTO[] = [];

    fora = true;

    constructor(private infosService: InfosService, private fb : FormBuilder, private grupoService : GrupoService) {

        this.form = this.fb.group({
            unidade: [null],
            setor: [{value: null, disabled: true}],
            papel: [{value: null, disabled: true}]
        });

        this.form.get("unidade").valueChanges.subscribe((novoValor : UnidadeOrcamentariaDTO) => {
            const selectSetor = this.form.get('setor');

            if(novoValor){
                this.infosService.getSetores(novoValor.guid).subscribe(setoresList => {
                    this.setores = setoresList;
                    selectSetor?.setValue(null);
                    selectSetor?.enable();
                });

            } else {
                this.setores = [];
                selectSetor?.setValue(null);
                selectSetor?.disable();
            }
            
        })

        this.form.get("setor").valueChanges.subscribe((novoValor : ISetorDTO) => {
            const selectPapel = this.form.get('papel');

            if(novoValor){
                this.infosService.getPapeis(novoValor.guid).subscribe(papeisList => {
                    
                    this.grupoService.grupoSession.subscribe(grupo => {
                        let subList = grupo.membros.map(user => user.sub);

                        this.papeis = papeisList.filter(papel => subList.indexOf(papel.agenteSub) < 0)
                    })

                })

                selectPapel?.enable();
            } else {
                selectPapel?.setValue(null);
                selectPapel?.disable();
            }
        })
        
        this.infosService.getUnidades().subscribe(unidadeList => {
            this.unidades = unidadeList;
        });
    }
  
    @HostListener("click", ["event"])
    clickFora (event : MouseEvent) {
        if(!this.fora){
            this.fora = true;
            return;
        }
        
        this.form.get("unidade").setValue(null),
        this.form.get("setor").setValue(null),
        this.form.get("papel").setValue(null)
        this.onClose.emit(null);
    }

    clickDentro(event : MouseEvent){
        this.fora = false;
    }

    salvar() {
        let cadastroMembroForm : ICadastroMembroForm = {
            orgao: this.form.get("unidade").value,
            setor: this.form.get("setor").value,
            papel: this.form.get("papel").value
        }
        this.form.get("unidade").setValue(null),
        this.form.get("setor").setValue(null),
        this.form.get("papel").setValue(null)

        this.onClose.emit(cadastroMembroForm);
    }
}