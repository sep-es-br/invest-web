import { HttpClient } from "@angular/common/http";

import { ErrorHandlerService } from "./error-handler.service";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { CustoDTO } from "../models/CustoDTO";
import { environment } from "../../../environments/environment";
import { IValoresTotaisCusto } from "../interfaces/valores-totais-custo.interface";

@Injectable({providedIn: "root"})
export class CustoService {

    readonly custoUrl = `${environment.apiUrl}/custo`

    constructor(
        private http : HttpClient,
        private errorHandlerService : ErrorHandlerService
    ) {

    }

    public getAllByExercicio(exercicio : string) : Observable<CustoDTO[]>{
        return this.http.get<CustoDTO[]>(`${this.custoUrl}/all`, { params: {
            exercicio: exercicio
        }}).pipe(catchError(this.errorHandlerService.handleError))
    }

    public getValoresTotaisCusto(exercicio : string) : Observable<IValoresTotaisCusto> {
        return this.http.get<IValoresTotaisCusto>(`${this.custoUrl}/totais`, {params: {
            exercicio: exercicio
        }}).pipe(catchError(this.errorHandlerService.handleError))
    }

    public getTotalPrevisto(ano : string) : Observable<number> {
        
        return this.http.get<number>(`${environment.apiUrl}/custo/totalPrevisto`, {params: {
            exercicio: ano
        }}).pipe(catchError(this.errorHandlerService.handleError))

    }


    public getTotalHomologado(ano : string) : Observable<number> {
          
        const totalHomologadoUrl = `${environment.apiUrl}/custo/totalHomologado`;

        return this.http.get<number>(totalHomologadoUrl, {params: {
            exercicio: ano
        }}).pipe(
            catchError(this.errorHandlerService.handleError))

    }


    public getTotalAutorizado() : Observable<number> {
        return this.http.get<number>(`${environment.apiUrl}/custo/totalAutorizado`).pipe(
            catchError(this.errorHandlerService.handleError))

    }


    public getTotalDisponivel() : Observable<number> {
        return this.http.get<number>(`${environment.apiUrl}/custo/totalDisponivel`).pipe(
            catchError(this.errorHandlerService.handleError))

    }
}