import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable } from "rxjs";
import { ITipoPlano } from "../interfaces/ITipoPlano";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class TipoPlanoService {

    private readonly tipoPlanoUrl = `${environment.apiUrl}/tipoPlano`;

    constructor(
        private http : HttpClient,
        private errorHandlerService : ErrorHandlerService
    ){}

    public findAll() : Observable<ITipoPlano[]> {

        return this.http.get<ITipoPlano[]>(`${this.tipoPlanoUrl}`)
        .pipe(catchError(err => this.errorHandlerService.handleError(err)))

    }

    public findBy(id? : string, sigla? : string) : Observable<ITipoPlano> {

        let params = new HttpParams();

        if(id)
            params = params.set("id", id)
        
        if(sigla)
            params = params.set("sigla", sigla)

        return this.http.get<ITipoPlano>(`${this.tipoPlanoUrl}`, {params: params})
        .pipe(catchError(err => this.errorHandlerService.handleError(err)))
    }

}