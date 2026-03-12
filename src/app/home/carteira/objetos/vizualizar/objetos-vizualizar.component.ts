import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { IObjeto } from "../../../../utils/interfaces/IObjeto";
import { ObjetosService } from "../../../../utils/services/objetos.service";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, concat, finalize, firstValueFrom, forkJoin, map, merge, mergeMap, Observable, of, skipWhile, tap } from "rxjs";
import { DataUtilService } from "../../../../utils/services/data-util.service";
import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { IFonteExercicio } from "../cadastro/fonte-exercicio.interface";
// import { ICusto } from "../cadastro/exercicio-cadastro.interface";
import { CustomCurrencyPipe } from "../../../../utils/pipes/customCurrency.pipe";
import { NumeroResumidoPipe } from "../../../../utils/pipes/numero-resumido.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { IPodeDTO } from "../../../../utils/models/PodeDto";
import { ICusto, IObjetoDetail } from "../../../../utils/interfaces/objetoDetail.interface";
import { cleanApoc } from "../../../../utils/funcoes-util";
import { FonteOrcamentariaService } from "../../../../utils/services/fonteOrcamentaria.service";

@Component({
    templateUrl: "./objetos-vizualizar.component.html",
    styleUrl: "./objetos-vizualizar.component.scss",
    imports: [
    CommonModule, CustomCurrencyPipe, NumeroResumidoPipe,
    FontAwesomeModule
]
})
export class ObjetosVizualizarComponent implements AfterViewInit {

    objeto : IObjetoDetail;

    editIcon = faPencil;

    permissao : IPodeDTO;

    linhas : {
        nivel : number,
        label : string,
        nome: string,
        planejado: number,
        contratado : number
    }[] = [];

    carregando = true;

    constructor(
        private objetoService : ObjetosService,
        private route : ActivatedRoute,
        private router : Router,
        private dataUtil: DataUtilService,
        private permissaoService : PermissaoService,
        private fonteSrv : FonteOrcamentariaService
    ){

        
        
        this.route.params.pipe(
            skipWhile((paramMap) => !('objetoId' in paramMap) ),
            mergeMap(({objetoId}) => this.objetoService.getById(objetoId).pipe(finalize(() => this.carregando = false))),
        ).subscribe((obj : IObjetoDetail) => {
            this.objeto = obj

            let nome = `${obj.siglaUnidade} - Objeto - ${obj.id}`;

            this.dataUtil.setTitleInfo('objetoId', nome);

            this.objeto.revisor = this.objeto.revisor.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            this.objeto.alterador = this.objeto.alterador.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            const fonteMapRequest : Record<string, Observable<FonteOrcamentariaDTO>> = {};

            Object.values(obj.custos)
                    .flatMap((custo) => Object.keys(custo))
                    .map(codFont => fonteMapRequest[codFont] = this.fonteSrv.findByCodigo(codFont).pipe(
                        catchError(err => {
                            console.log(err);
                            return of({nome: '[ERROR]'} as FonteOrcamentariaDTO);
                        })));
            
            forkJoin(fonteMapRequest).subscribe(fontMap => {
                for(const [ano, fontes] of Object.entries(obj.custos).sort(this.ordenarRecursosFinanceiro)){
                this.linhas.push({
                    nivel: 0,
                    label: 'Exercicio',
                    nome: `${ano}`,
                    planejado: this.somarValoresPlanejado(fontes),
                    contratado: this.somarValoresContratado(fontes)
                })

                for(const [fonte, valores] of Object.entries(fontes).sort(this.ordenarFontes)) {

                    this.linhas.push({
                        nivel: 1,
                        label: 'Fonte:',
                        nome: fontMap[fonte].nome,
                        planejado: valores.planejado,
                        contratado: valores.contratado
                    })

                    
                }
            }
            })
            

        })

    }

    async consultarCodigoFonte(codFonte: string){
        return await firstValueFrom(this.fonteSrv.findByCodigo(codFonte)); 
    }

    ngAfterViewInit(): void {
        this.permissaoService.getPermissao("carteiraobjetos").subscribe(permissao => this.permissao = permissao)
    }

    abrirEditar(){
        this.router.navigate(['edit'], {relativeTo: this.route});
    }

    somarValoresPlanejado(fontes : Record<string, ICusto>) {
        let total = 0;

        for(let valores of Object.values(fontes) ){
            total += valores.planejado;
        }

        return total;
    }

    somarValoresContratado(fontes : Record<string, ICusto>) {
        let total = 0;

        for(let valores of Object.values(fontes) ){
            total += valores.contratado;
        }

        return total;
    }

    ordenarRecursosFinanceiro([ano1, fontes1] : [string, Record<string, ICusto>], [ano2, fontes2] : [string, Record<string, ICusto>]) : number {
        return Number(ano1) - Number(ano2);
    }

    ordenarFontes([fonte1, val1] : [string, ICusto], [fonte2, val2] : [string, ICusto]) : number {
        return cleanApoc(fonte1).localeCompare(cleanApoc(fonte2));
    }

}