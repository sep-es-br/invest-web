import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable, retry } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { IPodeDTO } from "../models/PodeDto";

@Injectable({providedIn: "root"})
export class PermissaoService {
    
    private readonly permissaoUrl = `${environment.apiUrl}/permissao`;

    constructor(
        private http : HttpClient,
        private errorHendler : ErrorHandlerService
    ) {}

    public findByModuloGrupo(moduloId : string, grupoId : string) : Observable<IPodeDTO> {
        return this.http.get<IPodeDTO>(`${this.permissaoUrl}/byModuloGrupo`, {params: {
            moduloId: moduloId, grupoId: grupoId
        }}).pipe(catchError(err => this.errorHendler.handleError(err)))
    }

    public usuarioTemAcesso(pathId : string) : Observable<boolean> {
        return this.http.get<boolean>(`${this.permissaoUrl}/usuarioTemAcesso`, { params: {
            path : pathId
        } }).pipe(catchError(err => this.errorHendler.handleError(err)))
    }

}