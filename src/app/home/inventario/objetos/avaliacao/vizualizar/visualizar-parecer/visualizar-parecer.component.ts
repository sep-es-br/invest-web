import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { IParecer, parecerPadrao } from "../../../../../../utils/interfaces/parecer.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "spo-visualizar-parecer",
    standalone: true,
    templateUrl: "./visualizar-parecer.component.html",
    styleUrl: "./visualizar-parecer.component.scss",
    imports: [
        CommonModule, FontAwesomeModule
    ]
})
export class VisualizarParecerComponent {

    @ViewChild('principalRef', {read: ElementRef}) principalRef : ElementRef;

    @Input() parecer : IParecer = {...parecerPadrao};

    @Output() onClose = new EventEmitter<never>();

    fecharIcon = faXmark;

    @HostListener('click', ['$event'])
    clickFora(evt : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(evt.target))
            this.fechar();
    }


    fechar(){
        this.onClose.emit();
    }

}