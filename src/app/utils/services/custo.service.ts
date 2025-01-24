import { HttpClient } from "@angular/common/http";

import { ErrorHandlerService } from "./error-handler.service";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class CustoService {

    readonly custoUrl = `${environment.apiUrl}/custo`

    constructor(
        private http : HttpClient,
        private errorHandlerService : ErrorHandlerService,
        private router : Router
    ) {

    }

    
}