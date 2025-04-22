import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { IOrdemItem } from "../../interfaces/ordem-item.interface";

@Component({
    selector: 'spo-campo-ordenacao',
    templateUrl: './campo-ordenacao.component.html',
    styleUrl: './campo-ordenacao.component.scss',
    imports: [
        CommonModule, FontAwesomeModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CampoOrdenacaoComponent
        }
    ]
})
export class CampoOrdenacaoComponent implements ControlValueAccessor {
    
    static readonly NONE = 0;
    static readonly ASC = 1;
    static readonly DESC = 2;

    readonly opcoesOrdenacao = [faSort, faSortUp, faSortDown]
    
    selecao = 0;
    @Input() campo : string;

    onChange = (value : any) => {};
    onTouch = () => {};

    @HostListener('click', ['$event'])
    click(evt : MouseEvent) {
        this.mudarSeleção();
        this.onTouch();
    }

    mudarSeleção(){
        this.selecao = (this.selecao + 1) % 3;
        
        this.processarRetorno();

    }

    processarRetorno() {
        let retorno : IOrdemItem = undefined;

        if(this.selecao > 0) {
            retorno = {
                campo: this.campo,
                direcao: this.selecao == 1 ? 'ASC' : 'DESC'
            }
        }
        
        this.onChange(retorno);
    }
    
    writeValue(obj: any): void {
        if(isNaN(obj))
            return;

        this.selecao = obj as number;
        this.processarRetorno();
    }
    
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
       
    }


}
