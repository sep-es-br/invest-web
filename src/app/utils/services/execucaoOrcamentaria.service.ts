import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { environment } from "../../../environments/environment";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class ExecucaoOrcamentariaService {
    
    private readonly execucaoUrl = `${environment.apiUrl}/execucao`;

    constructor(private http : HttpClient,
         private errorHandlerService: ErrorHandlerService,
        private router : Router){
    }


    public getTotalOrcado(ano : string  ) : Observable<number> {
        return this.http.get<number>(`${this.execucaoUrl}/totalOrcado`, {params: {
            ano: ano
        }}).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }
}