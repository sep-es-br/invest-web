import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { ObjetoDTO } from "../models/ObjetoDTO";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class InfosService {

    
    constructor(private http : HttpClient, private errorHandlerService: ErrorHandlerService){
    }


    public getAllAnos() : Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/infos/allAnos`).pipe(
            catchError(this.errorHandlerService.handleError));
    }

}