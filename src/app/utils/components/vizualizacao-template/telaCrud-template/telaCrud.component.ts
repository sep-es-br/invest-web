import { CommonModule } from "@angular/common";
import { AfterContentInit, AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, ComponentRef, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, ViewContainerRef } from "@angular/core";
import { ITelaCrud } from "../ITelaCrud";
import { ISubTelaCrud } from "../ISubTelaCrud";

@Component({
    selector: "spo-tela-crud",
    standalone: true,
    templateUrl: "./telaCrud.component.html",
    styleUrl: "./telaCrud.component.scss",
    imports: [CommonModule]
})
export class TelaCrudComponent implements AfterViewInit, OnChanges{

    @ViewChild("containerResumo", {read: ViewContainerRef, static: true}) conteinerResumo : ViewContainerRef;
    @ViewChild("containerPrincipal", {read: ViewContainerRef, static: true}) conteinerPrincipal : ViewContainerRef;

    resumoRef : ComponentRef<unknown>;
    principalRef : ComponentRef<unknown>;

    @Input() telaConfig : ITelaCrud;
    @Input() data : any;

    telaSelecionada : ISubTelaCrud;

    constructor(private appRef : ApplicationRef){}

    ngAfterViewInit(): void {

        this.conteinerResumo.clear()
        this.resumoRef = this.conteinerResumo.createComponent(this.telaConfig.telaResumo);
        this.resumoRef.setInput("data", this.data);

        this.exibirTela(this.telaConfig.subTelas[0])
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.resumoRef?.setInput("data", changes["data"].currentValue);
        this.principalRef?.setInput("data", changes["data"].currentValue);
    }


    exibirTela(novaTela : ISubTelaCrud){
        this.telaSelecionada = novaTela;

        this.conteinerPrincipal.clear()
        this.principalRef = this.conteinerPrincipal.createComponent(novaTela.tela);
        this.principalRef.setInput("data", this.data);
        this.principalRef.changeDetectorRef.markForCheck()


    }

    telasAsEntries() : [string, any][] {
        return Object.entries(this.telaConfig.subTelas);
    }

}