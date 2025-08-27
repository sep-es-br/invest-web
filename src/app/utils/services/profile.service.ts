import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProfile } from '../interfaces/profile.interface';
import { ErrorHandlerService } from './error-handler.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { IAvatar } from '../interfaces/avatar.interface';
import { Router } from '@angular/router';
import { IPapelDTO } from '../models/PapelDto';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _urlSignin = `${environment.apiUrl}/signin`;
  private _url = `${environment.apiUrl}/usuario`;
  public sessionProfile$ = signal<IProfile>(undefined);


  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router : Router
  ) { }

  public getUserInfo(): Observable<IProfile> {
    return this.http.get<IProfile>(`${this._urlSignin}/user-info`).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    );
  }

  public getUser(userId?: number): Observable<IProfile> {
    const id = userId ?? this.sessionProfile$()?.id;
    const url = id ? `${this._url}/${id}` : this._url;

    return this.http.get<IProfile>(url).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    );
  }

  public salvarUsuario(usuario: IProfile) : Observable<IProfile> {
    return this.http.put<IProfile>(this._url, usuario).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )
  }
  
  public findByGrupo(grupoId : number): Observable<IProfile[]> {

    return this.http.get<IProfile[]>(`${this._url}/byGrupo`, {params: {
      grupoId: grupoId
    }}).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )

  }

  public static getPapelUsuario(user : IProfile) : IPapelDTO {

    if(!user) return undefined;
    
    if(user.papeis.length === 1)
      return user.papeis[0]
    else 
      return user.papeis.find(p => p.prioritario)
    

  }
}
