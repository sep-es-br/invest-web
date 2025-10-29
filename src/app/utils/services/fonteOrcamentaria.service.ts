import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { catchError, Observable, of, tap } from "rxjs";
import { FonteOrcamentariaDTO } from "../models/FonteOrcamentariaDTO";

@Injectable({providedIn: "root"})
export class FonteOrcamentariaService {

    private readonly fonteUrl = `${environment.apiUrl}/fonte`;

    private readonly cache = new Map<string, FonteOrcamentariaDTO>()

    
    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService){
    }

    public findByCodigo(codigo : string) : Observable<FonteOrcamentariaDTO> {
        if(this.cache.has(codigo)) {
            return of(this.cache.get(codigo))
        } else {
            return this.http.get<FonteOrcamentariaDTO>(`${this.fonteUrl}/byCodigo/${codigo}`).pipe(
                catchError(err => this.errorHandlerService.handleError(err)),
                tap(fonte => this.cache.set(codigo, fonte))
            )
        }
    }

    public findAll() : Observable<FonteOrcamentariaDTO[]> {
        return this.http.get<FonteOrcamentariaDTO[]>(this.fonteUrl).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

    public extras() : Observable<FonteOrcamentariaDTO[]> {
        return this.http.get<FonteOrcamentariaDTO[]>(`${this.fonteUrl}/extras`)
        .pipe(catchError(err => this.errorHandlerService.handleError(err)))
    }

    
}