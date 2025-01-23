import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { ObjetoTiraDTO } from "../../../../../utils/models/ObjetoTiraDTO";
import { CustomCurrencyPipe } from "../../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../../utils/pipes/numero-resumido.pipe";
import { ShortStringPipe } from "../../../../../utils/pipes/shortString.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEllipsis, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { IObjeto } from "../../../../../utils/interfaces/IObjeto";
import { IPodeDTO } from "../../../../../utils/models/PodeDto";

@Component({
    selector: 'spo-tira-listagem-objetos',
    templateUrl: './tira-objeto.component.html',
    styleUrl: './tira-objeto.component.scss',
    standalone: true,
    imports: [CommonModule, ShortStringPipe, CustomCurrencyPipe, NumeroResumidoPipe, FontAwesomeModule]
})
export class TiraObjetoComponent {

    acoesIcon = faEllipsis;
    removerIcon = faTrashCan;

    @Output() doClick = new EventEmitter<MouseEvent>();
    @Output() doRemover = new EventEmitter<ObjetoTiraDTO>();

    @ViewChild('iconAcao', {read: ElementRef}) opcoesBtn : ElementRef; 
    @ViewChild('iconBtn', {read: ElementRef}) opcoesIcon : ElementRef;


    @Input() permissao : IPodeDTO;
    @Input() objeto : ObjetoTiraDTO;

    menuFechado = true;

    @HostListener("document:click", ["$event"])
    clickHost(event : MouseEvent) {
        if(!this.opcoesIcon.nativeElement.contains(event.target))
            this.menuFechado = true;
    }

    @HostListener("click", ["$event"])
    makeDoClick(event : MouseEvent) {
        if(this.opcoesBtn.nativeElement.contains(event.target))
            return;

        this.doClick.emit(event);
            
    }

    makeDoRemover() {
        this.doRemover.emit(this.objeto);
    }

    toggleMenu() {
        this.menuFechado = !this.menuFechado
    }

    
    
}