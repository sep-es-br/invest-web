import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { IObjeto } from "../../../../utils/interfaces/IObjeto";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { ActivatedRoute, Router } from "@angular/router";
import { concat, merge, tap } from "rxjs";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { IFonteExercicio } from "../cadastro/fonte-exercicio.interface";
import { ICusto } from "../cadastro/exercicio-cadastro.interface";
import { CustomCurrencyPipe } from "../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../utils/pipes/numero-resumido.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { IPodeDTO } from "../../../../utils/models/PodeDto";

@Component({
    standalone: true,
    templateUrl: "./objetos-vizualizar.component.html",
    styleUrl: "./objetos-vizualizar.component.scss",
    imports: [
        CommonModule, CustomCurrencyPipe, NumeroResumidoPipe, 
        FontAwesomeModule
    ]
})
export class ObjetosVizualizarComponent implements AfterViewInit {

    objeto : IObjeto;

    editIcon = faPencil;

    permissao : IPodeDTO;

    linhas : {
        nivel : number,
        label : string,
        nome: string,
        previsto: number,
        contratado : number
    }[] = []

    constructor(
        private objetoService : ObjetosService,
        private route : ActivatedRoute,
        private router : Router,
        private dataUtil: DataUtilService,
        private permissaoService : PermissaoService
    ){
        
        this.route.params.subscribe(params => {
            
            merge(
                this.objetoService.getById(params['objetoId']).pipe(
                    tap(obj => {
                        this.objeto = obj


                        let nome = `${obj.conta.unidadeOrcamentariaImplementadora.sigla} - Objeto - ${obj.id.split(':')[2]}`;

                        this.dataUtil.setTitleInfo('objetoId', nome);


                        obj.recursosFinanceiros.sort(this.ordenarRecursosFinanceiro).forEach(custo => {
                            this.linhas.push({
                                nivel: 0,
                                label: 'Exercicio',
                                nome: `${custo.anoExercicio}`,
                                previsto: this.somarValoresPrevisto(custo.indicadaPor),
                                contratado: this.somarValoresContratado(custo.indicadaPor)
                            })

                            custo.indicadaPor.sort(this.ordenarFontes).forEach(fonte => {
                                this.linhas.push({
                                    nivel: 1,
                                    label: 'Fonte:',
                                    nome: `${fonte.fonteOrcamentaria.nome}`,
                                    previsto: fonte.previsto,
                                    contratado: fonte.contratado
                                })
                            })
                        })



                    })
                )
            ).subscribe();
        })

    }

    ngAfterViewInit(): void {
        this.permissaoService.getPermissao("carteiraobjetos").subscribe(permissao => this.permissao = permissao)
    }

    abrirEditar(){
        this.router.navigate(['edit'], {relativeTo: this.route});
    }

    somarValoresPrevisto(fontes : IFonteExercicio[]) {
        let total = 0;

        for(let fonte of fontes){
            total += fonte.previsto;
        }

        return total;
    }

    somarValoresContratado(fontes : IFonteExercicio[]) {
        let total = 0;

        for(let fonte of fontes){
            total += fonte.contratado;
        }

        return total;
    }

    ordenarRecursosFinanceiro(custo1 : ICusto, custo2 : ICusto) : number {
        return custo1.anoExercicio - custo2.anoExercicio;
    }

    ordenarFontes(fonte1 : IFonteExercicio, fonte2 : IFonteExercicio) : number {
        return fonte1.fonteOrcamentaria.nome.localeCompare(fonte2.fonteOrcamentaria.nome);
    }

}