import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { apontamentoPadrao, IApontamento } from "../../../../../../../utils/interfaces/apontamento.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGripVertical, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { CampoService } from "../../../../../../../utils/services/campo.service";
import { merge, tap } from "rxjs";
import { ICampo } from "../../../../../../../utils/interfaces/campo.interface";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "spo-item-apontamento",
    standalone: true,
    templateUrl: "./apontamento-item.component.html",
    styleUrl: "./apontamento-item.component.scss",
    imports: [
        CommonModule, FontAwesomeModule, FormsModule
    ]
})
export class ApontamentoItemComponent implements AfterViewInit {

    @ViewChild('removerIconRef', {read: ElementRef}) btnRemoverRef : ElementRef;

    @Input() apontamento : IApontamento = apontamentoPadrao;
    @Input() aberto : boolean = true;

    @Output() onclick = new EventEmitter<MouseEvent>();
    @Output() onRemover = new EventEmitter<MouseEvent>();
    
    itemIcon = faGripVertical;
    removerIcon = faMinusCircle;

    campos : ICampo[] = []

    constructor(
        private campoService : CampoService
    ){}

    clickHeader(evt : MouseEvent) {
        if(!this.btnRemoverRef.nativeElement.contains(evt.target)){
            this.onclick.emit(evt);
        }
    }

    ngAfterViewInit(): void {
        merge(
            this.campoService.findAll().pipe(
                tap( campoList => this.setCampos(campoList))
            )
        ).subscribe()
    }

    setCampos(campoList : ICampo[]){
        this.campos = campoList;
    }
    

}