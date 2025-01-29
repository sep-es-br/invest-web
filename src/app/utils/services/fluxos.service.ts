import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable } from "rxjs";
import { IFluxo } from "../interfaces/fluxo.interface";
import { HttpClient } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
    providedIn: "root"
})
export class FluxosService {

    private readonly urlFluxo = `${environment.apiUrl}/fluxo`;

    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
    ){}

    public findAll() : Observable<IFluxo[]> {

        return this.http.get<IFluxo[]>(`${this.urlFluxo}`)
        .pipe(catchError(err => this.errorHandler.handleError(err)));

    }

    public findWithEtapa(etapaId : string) : Observable<IFluxo> {

        return this.http.get<IFluxo>(`${this.urlFluxo}/withEtapa`, { params: {
            etapaId: etapaId
        } })
        .pipe(catchError(err => this.errorHandler.handleError(err)));

    }

}