import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ISetorDTO } from "../models/SetorDTO";
import { IPapelDTO } from "../models/PapelDto";
import { ICardsTotaisDto } from "../interfaces/valores-totais-custo.interface";

@Injectable({providedIn: "root"})
export class InfosService {

    private readonly infosUrl = `${environment.apiUrl}/infos`;
    
    constructor(private http : HttpClient){
    }


    public getAllAnos() : Observable<number[]> {
        return this.http.get<number[]>(`${this.infosUrl}/allAnos`)
    }

    public getIconesDisponiveis() : Observable<string[]> {
        return this.http.get<string[]>(`${this.infosUrl}/iconesDisponiveis`)
    }

    public getUnidades() : Observable<UnidadeOrcamentariaDTO[]>{
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.infosUrl}/unidades`)
    }

    public getSetores(unidadeGuid : string) : Observable<ISetorDTO[]> {
        return this.http.get<ISetorDTO[]>(`${this.infosUrl}/setores`, {params: {
            unidadeGuid: unidadeGuid
        }})
    }

    public getPapeis(setorGuid : string) : Observable<IPapelDTO[]> {
        return this.http.get<IPapelDTO[]>(`${this.infosUrl}/papeis`, {params: {
            setorGuid: setorGuid
        }})
    }

    public printError(error: any) {
        return this.http.post(`${this.infosUrl}/frontendError`, JSON.stringify(error))
    }

    public getCardTotais(
        nome : string, idUo : number[], idPo : number[], idFonte : number, ano : number, gnd : number,
        podeVerUnidades : boolean
    ) : Observable<ICardsTotaisDto> {

        let params = new HttpParams().set("ano",  ano);

        if(idUo && idUo.length > 0)
            params = params.set("idUo", JSON.stringify(idUo) )

        if(idFonte)
            params = params.set("idFonte", idFonte)

        if(idPo && idPo.length > 0)
            params = params.set("idPo", JSON.stringify(idPo))

        if(nome)
            params = params.set("nome", nome)

        if(gnd)
            params = params.set("gnd", gnd)

        params = params.set("podeVerUnidades", podeVerUnidades)

        return this.http.get<ICardsTotaisDto>(`${this.infosUrl}/cardsTotais`, {params: params})


    }

}