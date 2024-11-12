import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ObjetoDTO } from "../models/ObjetoDTO";
import { Observable } from "rxjs/internal/Observable";
import { InvestimentoDTO } from "../models/InvestimentoDTO";
import { ObjetoFiltroDTO } from "../models/ObjetoFiltroDTO";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class ObjetosService {

    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService
    ){
    }


    public getListaObjetos( filtro : ObjetoFiltroDTO ) : Observable<ObjetoDTO[]> {
        return this.http.get<ObjetoDTO[]>(`${environment.apiUrl}/objeto/all`, { params: {
            filtroJson: JSON.stringify(filtro)
        } }).pipe(catchError(this.errorHandlerService.handleError));
    }

}
