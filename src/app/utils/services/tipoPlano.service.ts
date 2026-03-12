import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable } from "rxjs";
import { ITipoPlano } from "../interfaces/ITipoPlano";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({providedIn: "root"})
export class TipoPlanoService {

    private readonly tipoPlanoUrl = `${environment.apiUrl}/tipoPlano`;

    constructor(
        private http : HttpClient
    ){}

    public findBy(id? : number, sigla? : string) : Observable<ITipoPlano | ITipoPlano[]> {

        let params = new HttpParams();

        if(id)
            params = params.set("id", id)
        
        if(sigla)
            params = params.set("sigla", sigla)

        return this.http.get<ITipoPlano | ITipoPlano[]>(`${this.tipoPlanoUrl}`, {params: params})
    }

    public fromSigefes(codPo : string) : Observable<ITipoPlano[]> {
        return this.http.get<ITipoPlano[]>(`${this.tipoPlanoUrl}/fromSigefes`, {params: {codPO: codPo}})
    }

}