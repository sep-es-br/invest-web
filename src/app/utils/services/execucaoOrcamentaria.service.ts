import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { environment } from "../../../environments/environment";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class ExecucaoOrcamentariaService {
    
    private readonly execucaoUrl = `${environment.apiUrl}/execucao`;

    constructor(private http : HttpClient, private erroHandleService: ErrorHandlerService){
    }


    public getTotalOrcado(ano : string  ) : Observable<number> {
        return this.http.get<number>(`${this.execucaoUrl}/totalOrcado`, {params: {
            ano: ano
        }}).pipe(
            catchError(this.erroHandleService.handleError)
        );
    }
}