import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class UnidadeOrcamentariaService {


    private readonly unidadeUrl = `${environment.apiUrl}/unidade`;

    constructor(private http : HttpClient,
        private router : Router
        ){
    }


    public getAllUnidadesOrcamentarias(version?:string) : Observable<UnidadeOrcamentariaDTO[]> {
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.unidadeUrl}/all`, {params: version && {version}})
    }

    public getUnidadeDoUsuario () : Observable<UnidadeOrcamentariaDTO[]> {
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.unidadeUrl}/doUsuario`)
    }

    public getFromSigefes () : Observable<UnidadeOrcamentariaDTO[]> {
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.unidadeUrl}/doSigefes`)
    }

    public getByCodigo (codigo: string) : Observable<UnidadeOrcamentariaDTO> {
        return this.http.get<UnidadeOrcamentariaDTO>(`${this.unidadeUrl}/byCodigo/${codigo}`)
    }

    

    

}