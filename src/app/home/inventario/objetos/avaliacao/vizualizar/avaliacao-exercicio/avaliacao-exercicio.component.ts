import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from "@angular/core";
import { ICusto } from "../exercicio-cadastro.interface";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { IFonteExercicio } from "../fonte-exercicio.interface";
import { ToastrService } from "ngx-toastr";
import { AvaliacaoExercicioFonteComponent } from "./avaliacao-exercicio-fonte/avaliacao-exercicio-fonte.component";

@Component({
    selector: "spo-avaliacao-exercicio",
    standalone: true,
    templateUrl: "./avaliacao-exercicio.component.html",
    styleUrl: "./avaliacao-exercicio.component.scss",
    imports: [
        CommonModule, AvaliacaoExercicioFonteComponent, FontAwesomeModule
    ]
})
export class AvaliacaoExercicioComponent implements AfterViewInit{

    @ViewChildren(AvaliacaoExercicioFonteComponent) fonteValores : QueryList<AvaliacaoExercicioFonteComponent>;

    addIcon = faPlusCircle;
    removerIcon = faMinusCircle;

    @Input() exercicio : ICusto;
    @Input() lastElem : boolean;

    @Output() onRemover = new EventEmitter<ICusto>();
    @Output() onAdd = new EventEmitter<never>();

    constructor(private toastr : ToastrService) {}
    
    getAlterado(valor : any) {
        console.log(valor)
    }

    removerFonte(fonte: IFonteExercicio){
        if(this.exercicio.indicadaPor.length === 1){
            this.toastr.error("A execução precisar ter ao menos uma fonte");
            return;
        }

        this.exercicio.indicadaPor = this.exercicio.indicadaPor.filter(valores => valores !== fonte);
    }

    validar() : boolean {
        let valido = true;
        
        this.fonteValores.forEach(fonteValor => {
            if(!fonteValor.validar())
                valido = false;
        })

        return valido;
    }


    ngAfterViewInit(): void {
        
    }

}