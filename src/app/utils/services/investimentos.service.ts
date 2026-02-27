import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, Observable, throwError } from "rxjs";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { Router } from "@angular/router";
import { InvestimentoTiraDTO } from "../models/InvestimentoTiraDTO";
import { IDataList } from "../interfaces/dataList.interface";
import { IOrdemItem } from "../interfaces/ordem-item.interface";
import { IContaLista } from "../interfaces/conta-lista.interface";
import { IContaDetail } from "../interfaces/conta-detail.interface";
import { IInvestimentoCadastro } from "../interfaces/investimento-cadastro.interface";
import { IConta } from "../interfaces/IConta";

@Injectable({providedIn: "root"})
export class InvestimentosService {

    private readonly investimentoUrl = `${environment.apiUrl}/investimento`;
   
    constructor(private http : HttpClient){
    }


    public getListaTiraInvestimentos( filtro : InvestimentoFiltro, ordem : IOrdemItem[] ) : Observable<IDataList<InvestimentoTiraDTO>> {

        return this.http.post<IDataList<InvestimentoTiraDTO>>(`${this.investimentoUrl}/filtrarValores`, 
            {
                ...filtro,
                ordem : ordem

            })
    }

    public getLista(
        term: string,
        podeVerUnidades: boolean,
        numPag: number,
        tamPag: number
    ) : Observable<IDataList<IContaLista>> {
        let params = {
            numPag,
            tamPag,
            podeVerUnidades,
            ...(term && {term})   
        }

        return this.http.get<IDataList<IContaLista>>(`${this.investimentoUrl}`, { params })
        
    }

    public getDetail(id: number) : Observable<IContaDetail> {
        return this.http.get<IContaDetail>(`${this.investimentoUrl}/${id}`)
    }

    public salvar(cadastroForm: IInvestimentoCadastro) : Observable<IContaDetail> {
        return this.http.post<IContaDetail>(`${this.investimentoUrl}`, cadastroForm)
    }

    public delete(idInvestimento: number) : Observable<void> {
        return this.http.delete<void>(`${this.investimentoUrl}/${idInvestimento}`)
    }

    public checarValor(codPo: string, codUo: string) : Observable<number> {
        return this.http.get<{existe: number}>(`${this.investimentoUrl}/checarPar/${codPo}/${codUo}`)
        .pipe(
            map(value => value.existe)
        )
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
