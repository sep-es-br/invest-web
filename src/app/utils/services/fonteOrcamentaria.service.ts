import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { catchError, Observable } from "rxjs";
import { FonteOrcamentariaDTO } from "../models/FonteOrcamentariaDTO";

@Injectable({providedIn: "root"})
export class FonteOrcamentariaService {

    private readonly fonteUrl = `${environment.apiUrl}/fonte`;

    
    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService){
   }

   public findAll() : Observable<FonteOrcamentariaDTO[]> {
        return this.http.get<FonteOrcamentariaDTO[]>(this.fonteUrl).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
   }
}