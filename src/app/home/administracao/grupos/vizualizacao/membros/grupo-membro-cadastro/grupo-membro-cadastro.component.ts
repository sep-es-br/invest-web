import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { IProfile } from "../../../../../../utils/interfaces/profile.interface";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../../../utils/models/UnidadeOrcamentariaDTO";
import { ISetorDTO } from "../../../../../../utils/models/SetorDTO";

@Component({
    selector: "spo-grupo-membro-cadastro",
    standalone: true,
    templateUrl: "./grupo-membro-cadastro.component.html",
    styleUrl: "./grupo-membro-cadastro.component.scss",
    imports: [CommonModule, ReactiveFormsModule]
})
export class GrupoMembroCadastroComponent {

    @Output() onClose = new EventEmitter<IProfile>();

    form : FormGroup;

    constructor(private hostElementRef : ElementRef, private fb : FormBuilder) {

        this.form = this.fb.group({
            unidade: [null],
            setor: [{value: null, disabled: true}],
            papel: [{value: null, disabled: true}]
        });

        this.form.get("unidade").valueChanges.subscribe(novoValor => {
            const selectSetor = this.form.get('setor');

            if(novoValor){
                selectSetor?.enable();
            } else {
                selectSetor?.disable();
            }
        })

        this.form.get("setor").valueChanges.subscribe(novoValor => {
            const selectPapel = this.form.get('papel');

            if(novoValor){
                selectPapel?.enable();
            } else {
                selectPapel?.disable();
            }
        })
    }


    unidades : UnidadeOrcamentariaDTO[] = [];
    setores : ISetorDTO[] = [];
    papeis : IProfile[] = [];

    fora = true;
  
    @HostListener("click", ["event"])
    clickFora (event : MouseEvent) {
        if(!this.fora){
            this.fora = true;
            return;
        }
        this.onClose.emit(null);
    }

    clickDentro(event : MouseEvent){
        this.fora = false;
    }
}