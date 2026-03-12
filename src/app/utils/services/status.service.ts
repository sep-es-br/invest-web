import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { IStatus } from "../interfaces/status.interface";

@Injectable({providedIn: "root"})
export class StatusService {

    private readonly statusUrl = `${environment.apiUrl}/status`;

    constructor(
        private http : HttpClient
    ){}

    public findAll(version?:string) : Observable<IStatus[]> {
        return this.http.get<IStatus[]>(`${this.statusUrl}`, {params: version && {version: version}})
    }

}