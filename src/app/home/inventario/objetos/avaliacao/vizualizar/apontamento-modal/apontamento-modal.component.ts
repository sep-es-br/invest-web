import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Host, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
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
export class ApontamentoModalComponent implements OnChanges {
    
    closeBtnIcon = faXmark;

    addBtn = faPlusCircle;

    @ViewChild('principalRef', {read: ElementRef}) principalRef : ElementRef;

    @Output() onFechar = new EventEmitter<MouseEvent>();
    @Output() onSalvar = new EventEmitter<IApontamento[]>();
    @Output() onRemover = new EventEmitter<IApontamento>();

    @Input() apontamentos : IApontamento[] = [];
    @Input() acao : IAcao;
    @Input() userId : string;

    apontamentoAberto : number = 0;

    constructor(
        private toastr : ToastrService
    ){}

    ngOnChanges(changes: SimpleChanges): void {
        let novoApontamentos = changes["apontamentos"]?.currentValue as IApontamento[];
        if(novoApontamentos){
            novoApontamentos = novoApontamentos.filter(a => a.active);
            this.apontamentos = novoApontamentos;
            this.apontamentoAberto = novoApontamentos.length - 1;
        }
    }

    @HostListener('click', ['$event'])
    clickFecha(evt : MouseEvent){
        if(!this.principalRef.nativeElement.contains(evt.target)){
            this.fechar(evt);
        }
    }

    fechar(evt : MouseEvent, success : boolean = false){
        if(success){
            this.onSalvar.emit(this.apontamentos);
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