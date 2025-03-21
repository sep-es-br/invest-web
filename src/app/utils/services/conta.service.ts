import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { catchError, Observable } from "rxjs";
import { InvestimentoTiraDTO } from "../models/InvestimentoTiraDTO";
import { IDataList } from "../interfaces/dataList.interface";
import { IDadoDetalhado } from "../interfaces/dado-detalhado.interface";
import { IFiltroInvestimento, IFiltroInvestimentoComPag } from "../../home/relatorio/detalhado/investimento-filtro/IFiltroInvestimento";

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

    public getDadosConsolidados(filtro : IFiltroInvestimentoComPag) : Observable<IDataList<IDadoDetalhado>> {

        let params : HttpParams = new HttpParams()
                        .set("pag", filtro.pag)
                        .set("pagSize", filtro.pagSize);

        if(filtro.exercicio) 
            params = params.set("exercicio", filtro.exercicio);
        
        if(filtro.unidade && filtro.unidade.length > 0)
            params = params.set("idsUnidade", JSON.stringify(filtro.unidade.map(u => u.id)) );

        if(filtro.plano && filtro.plano.length > 0)
            params = params.set("idsPlanos", JSON.stringify(filtro.plano.map(p => p.id)));

        if(filtro.fonte)
            params = params.set("idFonte", filtro.fonte.id);

        if(filtro.gnd)
            params = params.set("gnd", filtro.gnd);


        return this.http.get<IDataList<IDadoDetalhado>>(`${this.contaApi}/Investimento/dadosDetalhados/${filtro.exercicio}`, {params: params})
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