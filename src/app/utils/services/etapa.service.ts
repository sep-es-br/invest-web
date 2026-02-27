import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable } from "rxjs";
import { IEtapa } from "../interfaces/etapa.interface";


@Injectable({providedIn: "root"})
export class EtapaService {

    private readonly etapaUrl = `${environment.apiUrl}/etapa`;

    constructor(
        private http : HttpClient
    ){
    }

    public findAll() : Observable<IEtapa[]> {
        return this.http.get<IEtapa[]>(`${this.etapaUrl}`)
    }

    public getDoUsuario() : Observable<IEtapa> {
        return this.http.get<IEtapa>(`${this.etapaUrl}/doUsuario`)
    }


}
