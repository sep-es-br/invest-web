import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { IExecutarAcao } from "../interfaces/executar-acao.interface";
import { catchError, Observable } from "rxjs";
import { IObjeto } from "../interfaces/IObjeto";
import { IObjetoDetail } from "../interfaces/objetoDetail.interface";

@Injectable({providedIn: "root"})
export class AcaoService {
    
    private readonly acaoUrl = `${environment.apiUrl}/acao`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}

    public executarAcao(executarAcaoDto : IExecutarAcao) : Observable<IObjetoDetail> {
        return this.http.post<IObjetoDetail>(`${this.acaoUrl}/executarAcao`, executarAcaoDto)
        .pipe(catchError(err => this.errorHandler.handleError(err)));
    }

}