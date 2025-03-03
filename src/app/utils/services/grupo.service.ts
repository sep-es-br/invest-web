import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams, HttpStatusCode } from "@angular/common/http";
import { BehaviorSubject, catchError, EMPTY, Observable, throwError } from "rxjs";
import { GrupoDTO } from "../models/GrupoDTO";
import { ErrorHandlerService } from "./error-handler.service";
import { IHttpError } from "../interfaces/http-error.interface";
import { Router } from "@angular/router";
import { ICadastroMembroForm } from "../../home/administracao/grupos/vizualizacao/membros/grupo-membro-cadastro/CadastroMembroForm";
import { ToastrService } from "ngx-toastr";

@Injectable({providedIn: "root"})
export class GrupoService {

    public readonly grupoSession = new BehaviorSubject<GrupoDTO>(null);
    
    private readonly grupoUrl = `${environment.apiUrl}/grupo`;
    
    constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService,
        private router : Router,
        private toastr : ToastrService
    ){}

    public findByFilter(nome : string, pagAtual : number, tamPag : number) : Observable<GrupoDTO[]>{

        let params = new HttpParams();

        if(nome)
            params = params.set("nome", nome)

        params = params.set("pagAtual", pagAtual)
                    .set("tamPag", tamPag)

        return this.http.get<GrupoDTO[]>(`${this.grupoUrl}/byFilter`, {params: params}).pipe(
            catchError(err => this.errorHandler.handleError(err))
        )

    }

    public findAllBy(nome : string) : Observable<GrupoDTO[]> {

        let params = new HttpParams;

        if(nome)
            params = params.set("nome", nome)

        return this.http.get<GrupoDTO[]>(`${this.grupoUrl}`, { params: params })
        .pipe(catchError(err => this.errorHandler.handleError(err)));
    }

    public findById(idGrupo : string) {
        return this.http.get<GrupoDTO>(`${this.grupoUrl}`, {params: {grupoId: idGrupo}})
            .pipe(catchError(err => {
                let backendError = err.error as IHttpError;

                if(backendError.codigo = HttpStatusCode.NotFound) {
                    this.toastr.error(backendError.mensagem)
                    this.router.navigateByUrl("/home/administracao/grupo");
                    return EMPTY;
                }

                return throwError(() => err)

            }), catchError(err => this.errorHandler.handleError(err)))
    }

    public findByUsuario(idUsuario : string) : Observable<GrupoDTO[]> {
        return this.http.get<GrupoDTO[]>(`${this.grupoUrl}/byUsuario`, {params: {usuarioId: idUsuario}})
            .pipe(catchError(err => this.errorHandler.handleError(err)))
    }

    public save(grupo : GrupoDTO): Observable<GrupoDTO> {
        return this.http.put<GrupoDTO>(`${this.grupoUrl}/save`, grupo).pipe(
            catchError(err => this.errorHandler.handleError(err))
        )
    }

    public addMembro(membroForm : ICadastroMembroForm) : Observable<GrupoDTO> {
        return this.http.put<never>(`${this.grupoUrl}/addMembro`, membroForm).pipe(
            catchError(err => this.errorHandler.handleError(err))
        )
    }

    public remover(idGrupo : string) : Observable<GrupoDTO> {
        return this.http.delete<GrupoDTO>(`${this.grupoUrl}/`, {params: {
            idGrupo: idGrupo
        }}).pipe(catchError(err => this.errorHandler.handleError(err)));
    }

    public quantidadeMembros(idGrupo : string) : Observable<number> {
        return this.http.get<number>(`${this.grupoUrl}/quantidadeMembros`, {params: {
            grupoId: idGrupo
        }}).pipe(catchError(err => this.errorHandler.handleError(err)));
    }

    public removerMembro(idGrupo : string, idMembro : string) : Observable<GrupoDTO> {
        return this.http.delete<GrupoDTO>(`${this.grupoUrl}/membro`, {params: {
            idGrupo: idGrupo, idMembro: idMembro
        }}).pipe(catchError(err => this.errorHandler.handleError(err)));
    }

}