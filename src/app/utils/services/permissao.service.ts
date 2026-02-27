import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, first, firstValueFrom, Observable, of, retry, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { IPodeDTO } from "../models/PodeDto";
import { IItemMenu } from "../IItemMenu";

@Injectable({providedIn: "root"})
export class PermissaoService {
    
    private readonly permissaoUrl = `${environment.apiUrl}/permissao`;

    constructor(
        private http : HttpClient
    ) {}

    public findByModuloGrupo(moduloId : number, grupoId : number) : Observable<IPodeDTO> {
        return this.http.get<IPodeDTO>(`${this.permissaoUrl}/byModuloGrupo`, {params: {
            idModulo: moduloId, idGrupo: grupoId
        }})
    }

    public usuarioTemAcesso(pathId : string) : Observable<boolean> {
        return this.http.get<boolean>(`${this.permissaoUrl}/usuarioTemAcesso`, { params: {
            path : pathId
        } })
    }

    public getPermissao(pathId : string) : Observable<IPodeDTO> {
        return this.http.get<IPodeDTO>(`${this.permissaoUrl}`, { params: {
            path: pathId
        }})
    }

    public buildMenu() : Observable<IItemMenu[]> {
        return this.http.get<IItemMenu[]>(`${this.permissaoUrl}/buildMenu`)
        
    }

    public async isGestorMaster() : Promise<boolean> {
        return await firstValueFrom(
            this.http.get<boolean>(`${this.permissaoUrl}/isGestorMaster`)
        ) 

        
    }


}