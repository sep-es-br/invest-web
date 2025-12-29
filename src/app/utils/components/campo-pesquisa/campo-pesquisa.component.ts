import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "spo-campo-pesquisa",
    templateUrl: "./campo-pesquisa.component.html",
    styleUrl: "./campo-pesquisa.component.scss",
    host: {'id': 'pesquisa'},
    imports: [
        CommonModule, FormsModule, FontAwesomeModule
    ], 
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CampoPesquisaComponent
        }
    ]
})
export class CampoPesquisaComponent implements ControlValueAccessor {

    private _txtBusca : string;

    searchIcon = faMagnifyingGlass;

    get txtBusca() : string {
        return this._txtBusca;
    }

    set txtBusca(str : string) {
        this._txtBusca = str;
        this.onChange(str);
    }


    writeValue(obj: any): void {
        this.txtBusca = obj && String(obj);
        
    }

    onChange = (obj : any) => {};
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    onTouched = () => {};
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        
    }

    

    

    
}