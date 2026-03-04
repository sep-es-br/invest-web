import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { debounce, debounceTime, distinctUntilChanged, skip, tap } from "rxjs";
import { CampoOrdenacaoComponent } from "../../../../../utils/components/campo-ordenacao/campo-ordenacao.component";
import { IOrdemItem } from "../../../../../utils/interfaces/ordem-item.interface";

@Component({
    selector: 'spo-objetos-ordenacao',
    templateUrl: './objetos-ordenacao.component.html',
    styleUrl: './objetos-ordenacao.component.scss',
    imports: [
        CommonModule, CampoOrdenacaoComponent, ReactiveFormsModule, FontAwesomeModule, FormsModule
    ]
})
export class ObjetosOrdenacaoComponent implements AfterViewInit {

    @ViewChild("form", {read: NgForm}) form : NgForm;

    @Output() onChange = new EventEmitter<IOrdemItem[]>();
    @Output() setFiltro = new EventEmitter<IOrdemItem[]>();

    primeiraExec = true;

    readonly defaultValue = {
        nome: CampoOrdenacaoComponent.NONE,
        codUnidade: CampoOrdenacaoComponent.NONE,
        siglaUnidade: CampoOrdenacaoComponent.NONE,
        codPo: CampoOrdenacaoComponent.NONE,
        planejado: CampoOrdenacaoComponent.NONE,
        contratado: CampoOrdenacaoComponent.NONE,
        autorizado: CampoOrdenacaoComponent.NONE,
        empenhado: CampoOrdenacaoComponent.NONE,
        dispSReserva: CampoOrdenacaoComponent.NONE
    };

    filtroOrdem = {...this.defaultValue};

    limparFiltroIcon = faFilterCircleXmark;

    limparFiltro() {
        this.filtroOrdem = {...this.defaultValue}
    }

    ngAfterViewInit(): void {
        this.form.valueChanges
        .pipe(
            debounceTime(0),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
            tap((filtroOrdem : IOrdemItem[]) => this.onChange.emit( Object.values(filtroOrdem).filter(v => !!v) ))
        ).subscribe();

    }
    

}