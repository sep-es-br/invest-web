import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable } from "rxjs";
import { IOrgaoDTO } from "../models/OrgaoDTO";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class OrgaoService {

    private readonly orgaoUrl = `${environment.apiUrl}/orgao`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}

    public getOrgaosSigefes() : Observable<IOrgaoDTO[]> {
        return this.http.get<IOrgaoDTO[]>(`${this.orgaoUrl}/doSigefes`)
        .pipe(catchError(err => this.errorHandler.handleError(err)))
    }

}