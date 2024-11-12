import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class UnidadeOrcamentariaService {


    constructor(private http : HttpClient, private erroHandleService: ErrorHandlerService){
    }


    public getAllUnidadesOrcamentarias(  ) : Observable<UnidadeOrcamentariaDTO[]> {
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${environment.apiUrl}/unidade/all`).pipe(
            catchError(this.erroHandleService.handleError)
        );
    }

}