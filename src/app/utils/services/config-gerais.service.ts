import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IConfigGeraisForm } from '../interfaces/config-gerais-form.interface';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigGeraisService {


  private readonly configApi = `${environment.apiUrl}/configGerais`

  constructor(
        private http : HttpClient
  ){}

  public buscar() : Observable<IConfigGeraisForm> {
      return this.http.get<IConfigGeraisForm>(`${this.configApi}`)
  }

  public checarEmRevisao() : Observable<Boolean> {
      return this.http.get<Boolean>(`${this.configApi}/checarEmRevisao`)
  }

  public salvar(config : IConfigGeraisForm) : Observable<IConfigGeraisForm> {
      return this.http.put<IConfigGeraisForm>(`${this.configApi}`, config)
  }

}
