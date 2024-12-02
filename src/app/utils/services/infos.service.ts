import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { ObjetoDTO } from "../models/ObjetoDTO";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class InfosService {

    private readonly infosUrl = `${environment.apiUrl}/infos`;
    
    constructor(private http : HttpClient,
         private errorHandlerService: ErrorHandlerService,
        private router : Router){
    }


    public getAllAnos() : Observable<string[]> {
        return this.http.get<string[]>(`${this.infosUrl}/allAnos`).pipe(
            catchError(err => this.errorHandlerService.handleError(err)));
    }

    public getIconesDisponiveis() : Observable<string[]> {
        return this.http.get<string[]>(`${this.infosUrl}/iconesDisponiveis`).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        )
    }

}