import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { InvestimentoDTO } from "../models/InvestimentoDTO";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class InvestimentosService {

    private readonly investimentoUrl = `${environment.apiUrl}/investimento`;
   
    constructor(private http : HttpClient, private errorHandlerService: ErrorHandlerService){
    }

    public getListaInvestimentos( filtro : InvestimentoFiltro ) : Observable<InvestimentoDTO[]> {
        
        return this.http.get<InvestimentoDTO[]>(`${this.investimentoUrl}/all`, {params: this.filterToParams(filtro)}).pipe(
                catchError(this.errorHandlerService.handleError)
            );
    }

    public getQuantidadeItens( filtro : InvestimentoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.investimentoUrl}/count`, {params: this.filterToParams(filtro)}).pipe(
            catchError(this.errorHandlerService.handleError)
        );
    }

    public filterToParams(filtro : InvestimentoFiltro) : HttpParams {
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
