import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SeletorIconeComponent } from "../../../../utils/components/seletor-icone/seletor-icone.component";

@Component({
    selector: "spo-grupo-cadastro",
    standalone: true,
    templateUrl: "./grupo-cadastro.component.html",
    styleUrl: "./grupo-cadastro.component.scss",
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, SeletorIconeComponent]
})
export class GrupoCadastroComponent {

    @Output() onClose = new EventEmitter<GrupoDTO>();


    iconSalvar = faFloppyDisk;

    fora = true;

    form = new FormGroup({
        nome: new FormControl(""),
        sigla: new FormControl(""),
        descricao: new FormControl(""),
        icone: new FormControl("question_mark")
    })

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

    gerarSigla(event : FocusEvent) {
        if(this.form.get("sigla").touched) return;

        const campoNome = event.target as HTMLInputElement;
        const nome = campoNome.value;
        
        let sigla = "";

        nome.split(" ").forEach(nome => {
            if(nome.length > 4) {
                sigla += nome[0].toUpperCase()
            }
        })

        this.form.get("sigla").setValue(sigla);
    }

    salvar(){
        const novoGrupo : GrupoDTO = {
            id: null,
            nome: this.form.get("nome").value,
            sigla: this.form.get("sigla").value,
            icone: this.form.get("icone").value,
            descricao: this.form.get("descricao").value,
            membros: []
        }

        this.onClose.emit(novoGrupo);
    }


}