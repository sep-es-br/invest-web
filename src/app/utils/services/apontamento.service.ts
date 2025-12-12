import { Injectable } from "@angular/core";
import { IApontamento } from "../interfaces/apontamento.interface";
import { IEtapa } from "../interfaces/etapa.interface";
import { BehaviorSubject, catchError, first, Observable } from "rxjs";
import { IObjeto } from "../interfaces/IObjeto";
import { IProfile } from "../interfaces/profile.interface";
import { GrupoDTO } from "../models/GrupoDTO";
import { ICampo } from "../interfaces/campo.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({providedIn: "root"})
export class ApontamentoService {

    private readonly _url = `${environment.apiUrl}/apontamento`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}
 
    public findByObjeto(objId : number) : Observable<IApontamento[]>{

        return this.http.get<IApontamento[]>(`${this._url}/byObjeto/${objId}`).pipe(
            catchError(err => this.errorHandler.handleError(err))
        )

    }

}