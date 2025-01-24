import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable } from "rxjs";
import { ITipoPlano } from "../interfaces/ITipoPlano";
import { HttpClient } from "@angular/common/http";
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

}