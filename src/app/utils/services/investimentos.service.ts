import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";
import { InvestimentoTiraDTO } from "../models/InvestimentoTiraDTO";
import { IDataList } from "../interfaces/dataList.interface";

@Injectable({providedIn: "root"})
export class InvestimentosService {

    private readonly investimentoUrl = `${environment.apiUrl}/investimento`;
   
    constructor(private http : HttpClient,
         private errorHandlerService: ErrorHandlerService,
        private router : Router){
    }

    // public getListaInvestimentos( filtro : InvestimentoFiltro ) : Observable<InvestimentoDTO[]> {
        
    //     return this.http.get<InvestimentoDTO[]>(`${this.investimentoUrl}/all`, {params: this.filterToParams(filtro)}).pipe(
    //             catchError(err => this.errorHandlerService.handleError(err))
    //         );
    // }

    public getListaTiraInvestimentos( filtro : InvestimentoFiltro ) : Observable<IDataList<InvestimentoTiraDTO>> {
        
        return this.http.get<IDataList<InvestimentoTiraDTO>>(`${this.investimentoUrl}/filtrarValores`, {params: this.filterToParams(filtro)}).pipe(
                catchError(err => this.errorHandlerService.handleError(err))
            );
    }

    public getQuantidadeItens( filtro : InvestimentoFiltro) : Observable<number> {
        return this.http.get<number>(`${this.investimentoUrl}/countValores`, {params: this.filterToParams(filtro)}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    
    public filterToParams(filtro : InvestimentoFiltro) : HttpParams {
        let params : HttpParams = new HttpParams();

        if(filtro.nome)
            params = params.set("nome", filtro.nome) 

        if(filtro.codUnidade)
            params = params.set("codUnidade", JSON.stringify(filtro.codUnidade)) 

        if(filtro.codPO)
            params = params.set("codPO", JSON.stringify(filtro.codPO)) 

        if(filtro.idFonte)
            params = params.set("idFonte", filtro.idFonte)

        if(filtro.numPag)
            params = params.set("numPag", filtro.numPag)

        if(filtro.qtPorPag)
            params = params.set("qtPorPag", filtro.qtPorPag) 

        if(filtro.gnd)
            params = params.set("gnd", filtro.gnd)

        params = params.set("verUnidades", filtro.verUnidades)


        return params.set("exercicio", filtro.exercicio)
    }

}
