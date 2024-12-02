import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ObjetoDTO } from "../models/ObjetoDTO";
import { Observable } from "rxjs/internal/Observable";
import { ObjetoFiltro } from "../models/ObjetoFiltro";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class ObjetosService {

    private readonly objetoUrl = `${environment.apiUrl}/objeto`;

    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private router:Router
    ){
    }


    public getListaObjetos( filtro : ObjetoFiltro, pgAtual : number, tamPg : number ) : Observable<ObjetoDTO[]> {

        let params = this.objetoFilterToParams(filtro)
                        .set("pgAtual", pgAtual)
                        .set("tamPag", tamPg);
        

        return this.http.get<ObjetoDTO[]>(`${this.objetoUrl}/all`, { params: params }).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    

    public getQuantidadeItens( filtro : InvestimentoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.objetoUrl}/count`, {params: this.investimentoFilterToParams(filtro)}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public objetoFilterToParams(filtro : ObjetoFiltro) : HttpParams {
        let params : HttpParams = new HttpParams();

        if(filtro.nome) 
            params = params.set("nome", filtro.nome)

        if(filtro.unidadeId)
            params = params.set("idUnidade", filtro.unidadeId)

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


        return params.set("exercicio", filtro.exercicio)
    }

}
