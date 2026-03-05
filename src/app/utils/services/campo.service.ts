import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { ICampo } from "../interfaces/campo.interface";

@Injectable({providedIn: 'root'})
export class CampoService {

    private readonly campoUrl = `${environment.apiUrl}/campo`;

    constructor(
        private http : HttpClient
    ){}

    findAll() : Observable<ICampo[]>{
        return this.http.get<ICampo[]>(`${this.campoUrl}`)
    }

}