import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Host, HostListener, Input, Output, ViewChild } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPlusCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { apontamentoPadrao, IApontamento } from "../../../../../../utils/interfaces/apontamento.interface";
import { ApontamentoItemComponent } from "./apontamento-item/apontamento-item.component";
import { IAcao } from "../../../../../../utils/interfaces/acao.interface";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "spo-modal-apontamento",
    standalone: true,
    templateUrl: "./apontamento-modal.component.html",
    styleUrl: "./apontamento-modal.component.scss",
    imports: [
    CommonModule, FontAwesomeModule,
    ApontamentoItemComponent
]
})
export class ApontamentoModalComponent {
    
    closeBtnIcon = faXmark;

    addBtn = faPlusCircle;

    @ViewChild('principalRef', {read: ElementRef}) principalRef : ElementRef;

    @Output() onFechar = new EventEmitter<MouseEvent>();
    @Output() onSalvar = new EventEmitter<MouseEvent>();

    @Input() apontamentos : IApontamento[] = [];
    @Input() acao : IAcao;

    apontamentoAberto : number = 0;

    constructor(
        private toastr : ToastrService
    ){}

    @HostListener('click', ['$event'])
    clickFecha(evt : MouseEvent){
        if(!this.principalRef.nativeElement.contains(evt.target)){
            this.fechar(evt);
        }
    }

    fechar(evt : MouseEvent, success : boolean = false){
        if(success){
            this.onSalvar.emit(evt);
        } else {
            this.onFechar.emit(evt);
        }
        
    }

    mudarApontamento(novoApontamentoAberto : number) {
        this.apontamentoAberto = novoApontamentoAberto;
    }

    removerApontamento(apontamentoIndex : number) {
        
        if(this.apontamentos.length === 1){
            this.toastr.error('É obrigatorio ao menos 1 apontamento');
            return;
        }

        this.apontamentos.splice(apontamentoIndex, 1);

        this.apontamentoAberto = Math.min(this.apontamentos.length-1, this.apontamentoAberto);
    }

    addApontamento(){
        this.apontamentos.push({ ...apontamentoPadrao});
        this.apontamentoAberto = this.apontamentos.length - 1;
    }

}