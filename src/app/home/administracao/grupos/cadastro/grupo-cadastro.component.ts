import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from "@angular/forms";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SeletorIconeComponent } from "../../../../utils/components/seletor-icone/seletor-icone.component";

@Component({
    selector: "spo-grupo-cadastro",
    templateUrl: "./grupo-cadastro.component.html",
    styleUrl: "./grupo-cadastro.component.scss",
    imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, SeletorIconeComponent]
})
export class GrupoCadastroComponent implements OnInit {

    @Output() onClose = new EventEmitter<GrupoDTO>();

    @ViewChild("principal", {read: ElementRef}) principalRef : ElementRef

    @Input() grupo : Partial<GrupoDTO>;

    standaloneModelOpt = {standalone: true}

    iconSalvar = faFloppyDisk;
    iconFechar = faXmark;

    @HostListener("click", ["$event"])
    clickFora (event : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(event.target)){

            this.fechar()
        }
        
    }

    ngOnInit(): void {
        if (!this.grupo) {
            this.grupo = { icone: 'question_mark' };
        }
    }

    gerarSigla(event : FocusEvent, formCtrlSigla : NgModel) {
        if(formCtrlSigla.touched) return;

        const campoNome = event.target as HTMLInputElement;
        const nome = campoNome.value;
        
        let sigla = "";

        nome.split(" ").forEach(nome => {
            if(nome.length > 4) {
                sigla += nome[0].toUpperCase()
            }
        })

        this.grupo.sigla = sigla;
    }

    fechar() {
        this.onClose.emit(null);
    }

    salvar(){
        
        this.onClose.emit(this.grupo as GrupoDTO);
    }


}