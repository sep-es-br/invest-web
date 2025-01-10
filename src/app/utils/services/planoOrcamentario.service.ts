import { Observable } from "rxjs/internal/Observable";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";

@Injectable({providedIn: "root"})
export class PlanoOrcamentarioService {

    private readonly planoApi = `${environment.apiUrl}/planoOrcamentario`;

    constructor(private http : HttpClient,
                private errorHandlerService : ErrorHandlerService,
                private router : Router
    ){
    }


    public getAllPlanos(  ) : Observable<PlanoOrcamentarioDTO[]> {
        return this.http.get<PlanoOrcamentarioDTO[]>(`${this.planoApi}/all`).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public getDoSigefes (unidade : UnidadeOrcamentariaDTO) : Observable<PlanoOrcamentarioDTO[]> {
        let params = new HttpParams();
        
        if(unidade)
            params = params.set("codigo", unidade.codigo)

        return this.http.get<PlanoOrcamentarioDTO[]>(`${this.planoApi}/doSigefes`, {params: params})
        .pipe(catchError(err => this.errorHandlerService.handleError(err)));
    }

}
