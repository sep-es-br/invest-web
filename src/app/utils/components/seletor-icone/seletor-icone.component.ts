import { AfterViewInit, Component, ElementRef, HostListener, Input, Output, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR, ReactiveFormsModule, SelectControlValueAccessor } from "@angular/forms";
import { InfosService } from "../../services/infos.service";
import { CommonModule } from "@angular/common";
import { tap } from "rxjs";

@Component({
    selector: "spo-seletor-icone",
    standalone: true,
    templateUrl: "./seletor-icone.component.html",
    styleUrl: "./seletor-icone.component.scss",
    imports: [CommonModule, ReactiveFormsModule],
    providers:[{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: SeletorIconeComponent
    }]
})
export class SeletorIconeComponent implements ControlValueAccessor, AfterViewInit {
    value : string;

    @ViewChild('iconesDisponivel', {read: ElementRef}) iconesDisponivelRef : ElementRef;

    iconeDisponivelElem : HTMLElement;

    editavel : boolean;

    window = window;
    
    iconesFiltrados : string[] = [];
    todosIcones : string[] = [];

    mostrarIcones = false;

    onChange: (val: string) => {};
    onTouched!: () => {};

    inNomeIcone = new FormControl(null);

    constructor(private infosService : InfosService,
            private hostElementRef : ElementRef
    ){}

    @HostListener("document:click", ["$event"])
    clickFora(event : MouseEvent) {
        if(!this.hostElementRef.nativeElement.contains(event.target)) {
            this.mostrarIcones = false;
        }
    }

    ngAfterViewInit(): void {
        this.infosService.getIconesDisponiveis().subscribe(icones => {
            this.todosIcones = icones
            this.filtrar("")
    })
        this.inNomeIcone.valueChanges.pipe(tap(nome => {
               this.filtrar(nome);
        })).subscribe();
        this.filtrar("");
    }

    filtrar(nome : string){

        this.iconesFiltrados = this.todosIcones.filter(icone => icone.includes(nome));
    }

    writeValue(obj: any): void {
        this.value = String(obj);
    }
    
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.editavel = isDisabled;
    }

    setIcone(icone : string){
        this.writeValue(icone);
        this.mostrarIcones = false;
        this.onChange(this.value);
        this.onTouched()
    }

    
}