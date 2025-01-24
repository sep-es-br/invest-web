import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from "@angular/common/http";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { IAreaTematica } from "../interfaces/IAreaTematica";
import { ErrorHandlerService } from "./error-handler.service";
import { IHttpError } from "../interfaces/http-error.interface";
import { ToastrService } from "ngx-toastr";

@Injectable({providedIn: "root"})
export class AreaTematicaService {



    private readonly areaTematicaUrl = `${environment.apiUrl}/areaTematica`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService,
        private toastr : ToastrService
    ){}

    public findAllAreaTematica() : Observable<IAreaTematica[]>{

        return this.http.get<IAreaTematica[]>(`${this.areaTematicaUrl}`)
            .pipe(
                catchError((err : HttpErrorResponse) => {
                    let httpError = err.error as IHttpError;
                    
                    if(httpError.codigo == HttpStatusCode.NotImplemented ) {
                        this.toastr.error(httpError.mensagem);
                        return EMPTY;
                    }

                    throw err
                }),
                catchError(err => this.errorHandler.handleError(err))
            )
    }

}