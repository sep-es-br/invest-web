import { HttpClient } from "@angular/common/http";

import { ErrorHandlerService } from "./error-handler.service";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { CustoDTO } from "../models/CustoDTO";
import { environment } from "../../../environments/environment";
import { IValoresTotaisCusto } from "../interfaces/valores-totais-custo.interface";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class CustoService {

    readonly custoUrl = `${environment.apiUrl}/custo`

    constructor(
        private http : HttpClient,
        private errorHandlerService : ErrorHandlerService,
        private router : Router
    ) {

    }

    public getAllByExercicio(exercicio : string) : Observable<CustoDTO[]>{
        return this.http.get<CustoDTO[]>(`${this.custoUrl}/all`, { params: {
            exercicio: exercicio
        }}).pipe(catchError(err => this.errorHandlerService.handleError(err)))
    }

    public getValoresTotaisCusto(exercicio : string) : Observable<IValoresTotaisCusto> {
        return this.http.get<IValoresTotaisCusto>(`${this.custoUrl}/totais`, {params: {
            exercicio: exercicio
        }}).pipe(catchError(err => this.errorHandlerService.handleError(err)))
    }
}