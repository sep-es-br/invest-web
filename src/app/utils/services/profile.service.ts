import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProfile } from '../interfaces/profile.interface';
import { ErrorHandlerService } from './error-handler.service';
import { catchError, tap } from 'rxjs/operators';
import { IAvatar } from '../interfaces/avatar.interface';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _urlSignin = `${environment.apiUrl}/signin`;
  private _url = `${environment.apiUrl}/usuario`;
  private _sessionProfileSubject = new BehaviorSubject<IProfile>(null);
  public sessionProfile$ = this._sessionProfileSubject.asObservable();

  public userListener = new BehaviorSubject<IProfile>(null);

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

  public getAvatarFromLoggedSub(): Observable<IAvatar> {
    return this.http.get<IAvatar>(`${this._url}/avatar`).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )

  }

  public getUser(): Observable<IProfile> {

    return this.http.get<IProfile>(`${this._url}`).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )

  }

  public getUserWithAvatar(): Observable<IProfile> {

    return this.http.get<IProfile>(`${this._url}/comAvatar`).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )

  }

  public salvarUsuario(usuario: IProfile) : Observable<IProfile> {
    return this.http.put<IProfile>(this._url, usuario).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )
  }

  public findByGrupo(grupoId : string): Observable<IProfile[]> {

    return this.http.get<IProfile[]>(`${this._url}/byGrupo`, {params: {
      grupoId: grupoId
    }}).pipe(
      catchError(err => this.errorHandlerService.handleError(err))
    )

  }
}
