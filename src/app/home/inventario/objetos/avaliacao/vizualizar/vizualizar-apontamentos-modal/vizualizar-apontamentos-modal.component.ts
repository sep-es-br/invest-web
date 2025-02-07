import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { apontamentoPadrao, IApontamento } from "../../../../../../utils/interfaces/apontamento.interface";

@Component({
    selector: "spo-vizualizar-apontamento",
    standalone: true,
    templateUrl: "./vizualizar-apontamentos-modal.component.html",
    styleUrl: "./vizualizar-apontamentos-modal.component.scss",
    imports: [CommonModule, FontAwesomeModule]
})
export class VizualizarApontamentoModalComponent {
    
    @ViewChild('principalRef', {read: ElementRef}) principalRef : ElementRef;

    @Output() onClose = new EventEmitter<MouseEvent>();

    fecharIcon = faXmark;

    @Input() apontamentos : IApontamento[] = [
        { 
            campo : {
                campoId: "",
                nome: "Campo 1"
            },
            texto: "texto qualquer",
            grupo: {
                sigla: "TST",
                nome: "Teste",
                descricao: undefined,
                icone: undefined,
                membros: undefined,
                permissoes: undefined,
                podeVerTodasUnidades: undefined
            }
        }
    ]

    @HostListener('click', ['$event'])
    clickFora(evt : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(evt.target)){
            this.onClose.emit(evt)
        }
    }

}