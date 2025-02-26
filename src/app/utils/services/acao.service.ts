import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { IExecutarAcao } from "../interfaces/executar-acao.interface";
import { catchError, Observable } from "rxjs";
import { IObjeto } from "../interfaces/IObjeto";

@Injectable({providedIn: "root"})
export class AcaoService {
    
    private readonly acaoUrl = `${environment.apiUrl}/acao`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}

    public executarAcao(executarAcaoDto : IExecutarAcao) : Observable<IObjeto> {
        return this.http.post<IObjeto>(`${this.acaoUrl}/executarAcao`, executarAcaoDto)
        .pipe(catchError(err => this.errorHandler.handleError(err)));
    }

}