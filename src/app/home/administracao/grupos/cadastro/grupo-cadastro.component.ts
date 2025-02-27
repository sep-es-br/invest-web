import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
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
export class GrupoCadastroComponent implements OnChanges {

    @Output() onClose = new EventEmitter<GrupoDTO>();

    @ViewChild("principal", {read: ElementRef}) principalRef : ElementRef

    @Input() grupo : GrupoDTO;

    iconSalvar = faFloppyDisk;
    iconFechar = faXmark;

    form = new FormGroup({
        nome: new FormControl(""),
        sigla: new FormControl(""),
        descricao: new FormControl(""),
        icone: new FormControl("question_mark")
    })

    @HostListener("click", ["$event"])
    clickFora (event : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(event.target)){

            this.fechar()
        }
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        let grupo = changes["grupo"].currentValue as GrupoDTO;

        if(grupo) {
            this.form.controls.nome.setValue(grupo.nome);
            this.form.controls.sigla.setValue(grupo.sigla);
            this.form.controls.descricao.setValue(grupo.descricao);
            this.form.controls.icone.setValue(grupo.icone);

            this.form.markAllAsTouched({emitEvent: false})
        }
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

    fechar() {
        this.onClose.emit(null);
    }

    salvar(){
        const novoGrupo : GrupoDTO = {
            id: this.grupo?.id,
            nome: this.form.get("nome").value,
            sigla: this.form.get("sigla").value,
            icone: this.form.get("icone").value,
            descricao: this.form.get("descricao").value,
            membros: this.grupo ? this.grupo.membros : [],
            papeisMembro: this.grupo ? this.grupo.papeisMembro : [],
            setoresMembros: this.grupo ? this.grupo.setoresMembros : [],
            orgaoMembro: this.grupo ? this.grupo.orgaoMembro : [],
            permissoes: this.grupo ? this.grupo.permissoes : [],
        }

        this.onClose.emit(novoGrupo);
    }


}