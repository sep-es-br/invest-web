import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { catchError, Observable } from "rxjs";
import { IStatus } from "../interfaces/status.interface";

@Injectable({providedIn: "root"})
export class StatusService {

    private readonly statusUrl = `${environment.apiUrl}/status`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}

    public findAll() : Observable<IStatus[]> {
        return this.http.get<IStatus[]>(`${this.statusUrl}`)
                .pipe(catchError(err => this.errorHandler.handleError(err)));
    }

}