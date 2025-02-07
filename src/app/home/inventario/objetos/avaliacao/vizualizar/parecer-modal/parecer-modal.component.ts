import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, input, Output, ViewChild } from "@angular/core";
import { IParecer } from "../../../../../../utils/interfaces/parecer.interface";
import { FormsModule } from "@angular/forms";
import { IAcao } from "../../../../../../utils/interfaces/acao.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'spo-fazer-parecer-modal',
    standalone: true,
    templateUrl: "./parecer-modal.component.html",
    styleUrl: "./parecer-modal.component.scss",
    imports: [
        CommonModule, FormsModule, FontAwesomeModule
    ]
})
export class ParecerModalComponent {

    
    @ViewChild('principalRef',{read: ElementRef}) principalRef : ElementRef;

    @Output() onClose = new EventEmitter<AcaoEvent>();

    @Input() parecer : IParecer;
    @Input() acao : IAcao;

    fecharIcon = faXmark;
    
    @HostListener('click', ['$event'])
    clickFora(evt : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(evt.target)){
            this.fechar(undefined, evt);
        }
    }

    fechar(acao : IAcao, evt : MouseEvent){
        this.onClose.emit({
            acao: acao,
            evt: evt
        })
    }
    
}

export interface AcaoEvent {
    acao: IAcao, evt : MouseEvent
}