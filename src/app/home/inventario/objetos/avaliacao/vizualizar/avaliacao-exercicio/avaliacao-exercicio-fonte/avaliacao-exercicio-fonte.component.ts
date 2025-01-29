import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IFonteExercicio } from "../../fonte-exercicio.interface";
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { tap } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinusCircle, faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { OpcaoItemComponent } from "../../../../../../../utils/components/dropdown-com-filtro/opcao-item.component";
import { FonteOrcamentariaDTO } from "../../../../../../../utils/models/FonteOrcamentariaDTO";
import { FonteOrcamentariaService } from "../../../../../../../utils/services/fonteOrcamentaria.service";
import { DropdownFiltroComponent } from "../../../../../../../utils/components/dropdown-com-filtro/dropdown-com-filtro.component";

@Component({
    selector: "spo-avaliacao-exercicio-fonte",
    standalone: true, 
    templateUrl: "./avaliacao-exercicio-fonte.component.html",
    styleUrl: "./avaliacao-exercicio-fonte.component.scss",
    imports: [CommonModule, FormsModule, NgxMaskDirective, FontAwesomeModule, DropdownFiltroComponent, OpcaoItemComponent],
    providers: [provideNgxMask()]
})
export class AvaliacaoExercicioFonteComponent implements OnInit {

    limparIcon = faXmarkCircle;
    removerIcon = faMinusCircle;
    addIcon = faPlusCircle;

    @Input() fonteValores : IFonteExercicio;

    @Input() lastElem : boolean;

    @Output() onRemover = new EventEmitter<IFonteExercicio>();
    @Output() onAdd = new EventEmitter<never>();

    fontes : FonteOrcamentariaDTO[] = [];
    fontesFiltrados : FonteOrcamentariaDTO[] = [];

    public valido = false;
    public checado = false;

    constructor(
        private fonteService : FonteOrcamentariaService
    ) {}

    filtrarFonte(filtro : string) {
        this.fontesFiltrados = this.fontes.filter(fonte => fonte.codigo.includes(filtro) || fonte.nome.toUpperCase().includes(filtro.toUpperCase()))
    }

    setFontes(fontList: FonteOrcamentariaDTO[]) {
        this.fontes = fontList;
        if(this.fonteValores.fonteOrcamentaria)
            this.fonteValores.fonteOrcamentaria = this.fontes.find(f => f.codigo == this.fonteValores.fonteOrcamentaria.codigo);
        this.filtrarFonte("");
    }

    setFonte(fonte : FonteOrcamentariaDTO) {
        this.fonteValores.fonteOrcamentaria = this.fontes.find(f => f.codigo == fonte.codigo);
        if(this.checado)
            this.validar()
    }

    ngOnInit(): void {
        this.fonteService.getDoSigefes().pipe(
            tap(fonteList => this.setFontes(fonteList))
        ).subscribe();
    }

    validar() : boolean {
        this.valido = this.fonteValores.fonteOrcamentaria !== null;
        this.checado = true;

        return this.valido;
    }
}