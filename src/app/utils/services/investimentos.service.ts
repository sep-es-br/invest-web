import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { InvestimentoDTO } from "../models/InvestimentoDTO";
import { InvestimentoFiltroDTO } from "../models/InvestimentoFiltroDTO";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class InvestimentosService {

   
    constructor(private http : HttpClient, private errorHandlerService: ErrorHandlerService){
    }

    public getListaInvestimentos( filtro : InvestimentoFiltroDTO ) : Observable<InvestimentoDTO[]> {
        return this.http.get<InvestimentoDTO[]>(`${environment.apiUrl}/investimento/all`,
             {params: {filtroJson: JSON.stringify(filtro)}}).pipe(
                catchError(this.errorHandlerService.handleError)
            );
    }


}
