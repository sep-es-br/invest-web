import { ErrorHandler, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { LocalidadeDTO } from "../models/LocalidadeDTO";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class LocalidadeService {

    private readonly localidadeApi = `${environment.apiUrl}/localidade`

    constructor(
        private http : HttpClient,
        private errorHandler: ErrorHandlerService
    ){}

    public findAll() : Observable<LocalidadeDTO[]> {
        return this.http.get<LocalidadeDTO[]>(`${this.localidadeApi}`)
        .pipe(catchError(err => this.errorHandler.handleError(err)))
    }

}