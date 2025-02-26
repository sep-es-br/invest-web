import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ISetorDTO } from "../models/SetorDTO";
import { IPapelDTO } from "../models/PapelDto";
import { ICardsTotaisDto } from "../interfaces/valores-totais-custo.interface";

@Injectable({providedIn: "root"})
export class InfosService {

    private readonly infosUrl = `${environment.apiUrl}/infos`;
    
    constructor(private http : HttpClient,
         private errorHandlerService: ErrorHandlerService,
        private router : Router){
    }


    public getAllAnos() : Observable<number[]> {
        return this.http.get<number[]>(`${this.infosUrl}/allAnos`).pipe(
            catchError(err => this.errorHandlerService.handleError(err)));
    }

    public getIconesDisponiveis() : Observable<string[]> {
        return this.http.get<string[]>(`${this.infosUrl}/iconesDisponiveis`).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        )
    }

    public getUnidades() : Observable<UnidadeOrcamentariaDTO[]>{
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.infosUrl}/unidades`).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        )
    }

    public getSetores(unidadeGuid : string) : Observable<ISetorDTO[]> {
        return this.http.get<ISetorDTO[]>(`${this.infosUrl}/setores`, {params: {
            unidadeGuid: unidadeGuid
        }}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        )
    }

    public getPapeis(setorGuid : string) : Observable<IPapelDTO[]> {
        return this.http.get<IPapelDTO[]>(`${this.infosUrl}/papeis`, {params: {
            setorGuid: setorGuid
        }}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        )
    }

    public getCardTotais(
        nome : string, idUo : string[], idPo : string[], idFonte : string, ano : number, gnd : number,
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
            .pipe(catchError(err => this.errorHandlerService.handleError(err)))


    }

}