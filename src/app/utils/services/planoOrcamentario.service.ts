import { Observable } from "rxjs/internal/Observable";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs";
import { Router } from "@angular/router";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";

@Injectable({providedIn: "root"})
export class PlanoOrcamentarioService {

    private readonly planoApi = `${environment.apiUrl}/planoOrcamentario`;

    constructor(
        private http : HttpClient
    ){
    }


    public getAllPlanos(  ) : Observable<PlanoOrcamentarioDTO[]> {
        return this.http.get<PlanoOrcamentarioDTO[]>(`${this.planoApi}/all`)
    }

    public getDoSigefes (unidade : UnidadeOrcamentariaDTO) : Observable<PlanoOrcamentarioDTO[]> {
        let params = new HttpParams();
        
        if(unidade)
            params = params.set("codigo", unidade.codigo)

        return this.http.get<PlanoOrcamentarioDTO[]>(`${this.planoApi}/doSigefes`, {params: params})
    }

    public getByCodigo (codigo: string) : Observable<PlanoOrcamentarioDTO> {
        return this.http.get<PlanoOrcamentarioDTO>(`${this.planoApi}/byCodigo/${codigo}`)
    }

}
