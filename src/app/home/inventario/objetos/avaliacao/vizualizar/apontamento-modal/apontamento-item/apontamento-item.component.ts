import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { apontamentoPadrao, IApontamento } from "../../../../../../../utils/interfaces/apontamento.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGripVertical, faHandPointRight, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { CampoService } from "../../../../../../../utils/services/campo.service";
import { finalize, merge, tap } from "rxjs";
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
export class ApontamentoItemComponent implements AfterViewInit, OnChanges {

    @ViewChild('removerIconRef', {read: ElementRef}) btnRemoverRef : ElementRef;

    @Input() apontamento : IApontamento = apontamentoPadrao;
    @Input() aberto : boolean = true;

    @Output() onclick = new EventEmitter<MouseEvent>();
    @Output() onRemover = new EventEmitter<MouseEvent>();
    
    itemIcon = faHandPointRight;
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

    ngOnChanges(changes: SimpleChanges): void {
        // let novoApontamento = changes["apontamento"].currentValue as IApontamento;
        // console.log("novo apontamento")
        // console.log(novoApontamento.campo?.id);
        // console.log("lista de campos")
        // console.log(this.campos.map(c => c.id))
        // console.log(this.campos.find(c => c.id === novoApontamento.campo?.id));
        // // novoApontamento.campo = this.campos.find(c => c.id === novoApontamento.campo.id)
        

    }

    ngAfterViewInit(): void {
        merge(
            this.campoService.findAll().pipe(
                tap( campoList => this.setCampos(campoList)),
                finalize(() => this.apontamento.campo = this.campos.find(c => c.id === this.apontamento.campo?.id))
            )
        ).subscribe()
    }

    setCampos(campoList : ICampo[]){
        this.campos = campoList;
    }
    

}