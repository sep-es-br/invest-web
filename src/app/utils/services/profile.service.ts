import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProfile } from '../interfaces/profile.interface';
import { ErrorHandlerService } from './error-handler.service';
import { catchError, tap } from 'rxjs/operators';
import { IAvatar } from '../interfaces/avatar.interface';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _urlSignin = `${environment.apiUrl}/signin`;
  private _url = `${environment.apiUrl}/usuario`;
  private _sessionProfileSubject = new BehaviorSubject<IProfile>({token:"", id: null, sub: "", name:"", nomeCompleto: "", imgPerfil: null, telefone: "", email:"", role:[]});
  public sessionProfile$ = this._sessionProfileSubject.asObservable();

  public userListener = new BehaviorSubject<IProfile>(null);

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
  ) { }

  public getUserInfo(): Observable<IProfile> {
    return this.http.get<IProfile>(`${this._urlSignin}/user-info`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getAvatarFromSub(): Observable<IAvatar> {
    const profile = JSON.parse(sessionStorage.getItem("user-profile")) as IProfile;

    return this.http.get<IAvatar>(`${this._url}/avatar`, {params: {
      sub: profile.sub
    }}).pipe(
      catchError(this.errorHandlerService.handleError)
    )

  }

  public getUser(): Observable<IProfile> {
    const profile = JSON.parse(sessionStorage.getItem("user-profile")) as IProfile;

    return this.http.get<IProfile>(`${this._url}`, {params: {
      sub: profile.sub
    }}).pipe(
      catchError(this.errorHandlerService.handleError)
    )

  }

  public getUserWithAvatar(): Observable<IProfile> {
    const profile = JSON.parse(sessionStorage.getItem("user-profile")) as IProfile;

    return this.http.get<IProfile>(`${this._url}/comAvatar`, {params: {
      sub: profile.sub
    }}).pipe(
      catchError(this.errorHandlerService.handleError)
    )

  }

  public salvarUsuario(usuario: IProfile) : Observable<IProfile> {
    return this.http.put<IProfile>(this._url, usuario, {responseType: 'json'}).pipe(
      catchError(this.errorHandlerService.handleError)
    )
  }
}
