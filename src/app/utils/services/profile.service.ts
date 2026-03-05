import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProfile } from '../interfaces/profile.interface';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { IAvatar } from '../interfaces/avatar.interface';
import { Router } from '@angular/router';
import { IPapelDTO } from '../models/PapelDto';
import { IUsuarioResponse } from '../interfaces/usuarioResponse.interface';
import { IDataList } from '../interfaces/dataList.interface';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _urlSignin = `${environment.apiUrl}/signin`;
  private _url = `${environment.apiUrl}/usuario`;
  public sessionProfile$ = signal<IProfile>(undefined);
  public displayUser$ = signal<IProfile>(undefined);


  constructor(
    private http: HttpClient,
    private router : Router
  ) { }

  public getUserInfo(): Observable<IProfile> {
    return this.http.get<IProfile>(`${this._urlSignin}/user-info`)
  }

  public getUser(userId?: number): Observable<IProfile> {
    const id = userId ?? -1;
    const url = `${this._url}/${id}`;

    return this.http.get<IProfile>(url)
  }

  public salvarUsuario(usuario: any) : Observable<IProfile> {
    return this.http.put<IProfile>(this._url, usuario)
  }
  
  public getAllUser(pageNumber: number, pageSize: number, termo?: string): Observable<IDataList<IUsuarioResponse>> {
    
    let params = new HttpParams()
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize);

    if(termo) {
      params = params.set('term', termo);
    }
    
    return this.http.get<IDataList<IUsuarioResponse>>(this._url, {params: params})
  }

  public removerAgente(id : number) : Observable<IProfile> {
    return this.http.delete<IProfile>(`${this._url}/${id}`)
  }
  
  public findByGrupo(grupoId : number): Observable<IProfile[]> {

    return this.http.get<IProfile[]>(`${this._url}/byGrupo`, {params: {
      grupoId: grupoId
    }})

  }

  public static getPapelUsuario(user : IProfile) : IPapelDTO {

    if(!user) return undefined;
    
    if(user.papeis.length === 1)
      return user.papeis[0]
    else 
      return user.papeis.find(p => p.prioritario)
    

  }

}
