import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class UnidadeOrcamentariaService {


    private readonly unidadeUrl = `${environment.apiUrl}/unidade`;

    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private router : Router
        ){
    }


    public getAllUnidadesOrcamentarias(  ) : Observable<UnidadeOrcamentariaDTO[]> {
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.unidadeUrl}/all`).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public getUnidadeDoUsuario () : Observable<UnidadeOrcamentariaDTO> {
        return this.http.get<UnidadeOrcamentariaDTO>(`${this.unidadeUrl}/doUsuario`)
        .pipe(catchError(err => this.errorHandlerService.handleError(err)));
    }

    public getFromSigefes () : Observable<UnidadeOrcamentariaDTO[]> {
        return this.http.get<UnidadeOrcamentariaDTO[]>(`${this.unidadeUrl}/doSigefes`)
        .pipe(catchError(err => this.errorHandlerService.handleError(err)));
    }


    

    

}