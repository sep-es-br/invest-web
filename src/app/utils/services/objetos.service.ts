import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs/internal/Observable";
import { ObjetoFiltro } from "../models/ObjetoFiltro";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { Router } from "@angular/router";
import { ObjetoTiraDTO } from "../models/ObjetoTiraDTO";

@Injectable({providedIn: "root"})
export class ObjetosService {

    private readonly objetoUrl = `${environment.apiUrl}/objeto`;

    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private router:Router
    ){
    }


    public getListaTiraObjetos( filtro : ObjetoFiltro, pgAtual : number, tamPg : number ) : Observable<ObjetoTiraDTO[]> {

        let params = this.objetoFilterToParams(filtro)
                        .set("pgAtual", pgAtual)
                        .set("tamPag", tamPg);
        

        return this.http.get<ObjetoTiraDTO[]>(`${this.objetoUrl}/allTira`, { params: params }).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public getQuantidadeItens( filtro : ObjetoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.objetoUrl}/count`, {params: this.objetoFilterToParams(filtro)}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public getQuantidadeInvFiltroItens( filtro : InvestimentoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.objetoUrl}/countInvestimentoFiltro`, {params: this.investimentoFilterToParams(filtro)}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public objetoFilterToParams(filtro : ObjetoFiltro) : HttpParams {
        let params : HttpParams = new HttpParams();

        if(filtro.nome) 
            params = params.set("nome", filtro.nome)

        if(filtro.unidadeId)
            params = params.set("idUnidade", filtro.unidadeId)

        if(filtro.unidadeId)
            params = params.set("codPO", filtro.unidadeId)

        if(filtro.status)
            params = params.set("status", filtro.status)

        return params.set("exercicio", filtro.exercicio);
    }

    public investimentoFilterToParams(filtro : InvestimentoFiltro) : HttpParams {
        let params : HttpParams = new HttpParams();

        if(filtro.nome)
            params = params.set("nome", filtro.nome) 

        if(filtro.codUnidade)
            params = params.set("codUnidade", filtro.codUnidade) 

        if(filtro.codPO)
            params = params.set("codPO", filtro.codPO) 


        if(filtro.numPag)
            params = params.set("numPag", filtro.numPag)

        if(filtro.qtPorPag)
            params = params.set("qtPorPag", filtro.qtPorPag) 

        if(filtro.exercicio)
            params = params.set("exercicio", filtro.exercicio)


        return params
    }

}
