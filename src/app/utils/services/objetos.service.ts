import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ObjetoDTO } from "../models/ObjetoDTO";
import { Observable } from "rxjs/internal/Observable";
import { ObjetoFiltro } from "../models/ObjetoFiltro";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";

@Injectable({providedIn: "root"})
export class ObjetosService {

    private readonly objetoUrl = `${environment.apiUrl}/objeto`;

    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService
    ){
    }


    public getListaObjetos( filtro : ObjetoFiltro ) : Observable<ObjetoDTO[]> {
        return this.http.get<ObjetoDTO[]>(`${this.objetoUrl}/all`, { params: {
            filtroJson: JSON.stringify(filtro)
        } }).pipe(catchError(this.errorHandlerService.handleError));
    }

    

    public getQuantidadeItens( filtro : InvestimentoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.objetoUrl}/count`, {params: this.investimentoFilterToParams(filtro)}).pipe(
            catchError(this.errorHandlerService.handleError)
        );
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
