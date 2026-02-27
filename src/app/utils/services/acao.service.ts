import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { IExecutarAcao } from "../interfaces/executar-acao.interface";
import { catchError, Observable } from "rxjs";
import { IObjeto } from "../interfaces/IObjeto";
import { IObjetoDetail } from "../interfaces/objetoDetail.interface";

@Injectable({providedIn: "root"})
export class AcaoService {
    
    private readonly acaoUrl = `${environment.apiUrl}/acao`;

    constructor(
        private http : HttpClient
    ){}

    public executarAcao(executarAcaoDto : IExecutarAcao) : Observable<IObjetoDetail> {
        return this.http.post<IObjetoDetail>(`${this.acaoUrl}/executarAcao`, executarAcaoDto);
    }

}