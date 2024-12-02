import { Observable } from "rxjs/internal/Observable";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError } from "rxjs";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class PlanoOrcamentarioService {


    constructor(private http : HttpClient,
                private errorHandlerService : ErrorHandlerService,
                private router : Router
    ){
    }


    public getAllPlanos(  ) : Observable<PlanoOrcamentarioDTO[]> {
        return this.http.get<PlanoOrcamentarioDTO[]>(`${environment.apiUrl}/plano/all`).pipe(
            catchError(err => this.errorHandlerService.handleError(err))
        );
    }

}
