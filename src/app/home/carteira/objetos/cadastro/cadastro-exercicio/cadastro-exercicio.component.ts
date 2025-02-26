import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from "@angular/core";
import { ICusto } from "../exercicio-cadastro.interface";
import { CadastroExercicioFonteComponent } from "./cadastro-exercicio-fonte/cadastro-exercicio-fonte.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { IFonteExercicio } from "../fonte-exercicio.interface";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "spo-cadastro-exercicio",
    standalone: true,
    templateUrl: "./cadastro-exercicio.component.html",
    styleUrl: "./cadastro-exercicio.component.scss",
    imports: [
        CommonModule, CadastroExercicioFonteComponent, FontAwesomeModule
    ]
})
export class CadastroExercicioComponent implements AfterViewInit{

    @ViewChildren(CadastroExercicioFonteComponent) fonteValores : QueryList<CadastroExercicioFonteComponent>;

    addIcon = faPlusCircle;
    removerIcon = faMinusCircle;

    @Input() exercicio : ICusto;
    @Input() lastElem : boolean;
    @Input() contratadoEditavel : boolean = false;

    @Output() onRemover = new EventEmitter<ICusto>();
    @Output() onAdd = new EventEmitter<never>();

    constructor(private toastr : ToastrService) {}
    
    getAlterado(valor : any) {
        console.log(valor)
    }

    limparContratado() {
        this.fonteValores.forEach( f => f.limparContratado())
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