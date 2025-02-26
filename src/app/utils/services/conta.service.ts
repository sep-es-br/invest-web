import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { catchError, Observable } from "rxjs";
import { InvestimentoTiraDTO } from "../models/InvestimentoTiraDTO";

@Injectable({providedIn: "root"})
export class ContaService {

    private readonly contaApi = `${environment.apiUrl}/conta`

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}

    public findAllTira(filtro : InvestimentoFiltro) : Observable<InvestimentoTiraDTO[]> {
        return this.http.get<InvestimentoTiraDTO[]>(`${this.contaApi}/contaTira`, {params: this.filterToParams(filtro)}).pipe(
                        catchError(err => this.errorHandler.handleError(err))
                    );
    }

    public getCount(filtro : InvestimentoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.contaApi}/count`, {params: this.filterToParams(filtro)}).pipe(
                        catchError(err => this.errorHandler.handleError(err))
                    );
    }

    
    public filterToParams(filtro : InvestimentoFiltro) : HttpParams {
        let params : HttpParams = new HttpParams();

        if(filtro.nome)
            params = params.set("nome", filtro.nome) 

        if(filtro.codUnidade && filtro.codUnidade.length > 0)
            params = params.set("codUnidade", JSON.stringify(filtro.codUnidade) ) 

        if(filtro.codPO && filtro.codPO.length > 0)
            params = params.set("codPO", JSON.stringify(filtro.codPO)) 

        if(filtro.idFonte)
            params = params.set("idFonte", filtro.idFonte)
        


        if(filtro.numPag)
            params = params.set("numPag", filtro.numPag)

        if(filtro.qtPorPag)
            params = params.set("qtPorPag", filtro.qtPorPag) 


        return params.set("exercicio", filtro.exercicio)
    }

}