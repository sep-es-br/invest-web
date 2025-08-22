import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, first, firstValueFrom, Observable, of, retry, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { IPodeDTO } from "../models/PodeDto";
import { IItemMenu } from "../IItemMenu";

@Injectable({providedIn: "root"})
export class PermissaoService {
    
    private readonly permissaoUrl = `${environment.apiUrl}/permissao`;

    constructor(
        private http : HttpClient,
        private errorHendler : ErrorHandlerService
    ) {}

    public findByModuloGrupo(moduloId : string, grupoId : string) : Observable<IPodeDTO> {
        return this.http.get<IPodeDTO>(`${this.permissaoUrl}/byModuloGrupo`, {params: {
            idModulo: moduloId, idGrupo: grupoId
        }}).pipe(catchError(err => this.errorHendler.handleError(err)))
    }

    public usuarioTemAcesso(pathId : string) : Observable<boolean> {
        return this.http.get<boolean>(`${this.permissaoUrl}/usuarioTemAcesso`, { params: {
            path : pathId
        } }).pipe(catchError(err => this.errorHendler.handleError(err)))
    }

    public getPermissao(pathId : string) : Observable<IPodeDTO> {
        return this.http.get<IPodeDTO>(`${this.permissaoUrl}`, { params: {
            path: pathId
        }}).pipe(catchError(err => this.errorHendler.handleError(err)))
    }

    public buildMenu() : Observable<IItemMenu[]> {
        return this.http.get<IItemMenu[]>(`${this.permissaoUrl}/buildMenu`)
        .pipe(catchError(err => {
            return this.errorHendler.handleError(err)
            
        }))
    }

    public async isGestorMaster() : Promise<boolean> {
        return await firstValueFrom(
            this.http.get<boolean>(`${this.permissaoUrl}/isGestorMaster`)
            .pipe(catchError(err => this.errorHendler.handleError(err)))
        ) 

        
    }


}