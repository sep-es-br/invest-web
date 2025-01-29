import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ErrorHandlerService } from "./error-handler.service";
import { catchError, Observable } from "rxjs";
import { IEtapa } from "../interfaces/etapa.interface";


@Injectable({providedIn: "root"})
export class EtapaService {

    private readonly etapaUrl = `${environment.apiUrl}/etapa`;

    constructor(private http : HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private router:Router,
        private toastr : ToastrService
    ){
    }

    public findAll() : Observable<IEtapa[]> {
        return this.http.get<IEtapa[]>(`${this.etapaUrl}`)
        .pipe(catchError(err => this.errorHandlerService.handleError(err)))
    }


}
