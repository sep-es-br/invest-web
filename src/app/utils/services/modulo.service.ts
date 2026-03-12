import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { IModuloDTO } from "../models/ModuloDto";

@Injectable({providedIn: "root"})
export class ModuloService {

    private readonly moduloUrl = `${environment.apiUrl}/modulo`;

    constructor(private http : HttpClient){
   }

   public findAll() : Observable<IModuloDTO[]> {
        return this.http.get<IModuloDTO[]>(`${this.moduloUrl}/`)
   }

}