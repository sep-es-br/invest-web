import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../../environments/environment';
import { IConfigGeraisForm } from '../interfaces/config-gerais-form.interface';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigGeraisService {


  private readonly configApi = `${environment.apiUrl}/configGerais`

  constructor(
        private http : HttpClient,
        private errorHandler : ErrorHandlerService
  ){}

  public buscar() : Observable<IConfigGeraisForm> {
      return this.http.get<IConfigGeraisForm>(`${this.configApi}`).pipe(
          catchError(err => this.errorHandler.handleError(err))
      );
  }

  public checarEmRevisao() : Observable<Boolean> {
      return this.http.get<Boolean>(`${this.configApi}/checarEmRevisao`).pipe(
        catchError(err => this.errorHandler.handleError(err))
      );
  }

  public salvar(config : IConfigGeraisForm) : Observable<IConfigGeraisForm> {
      return this.http.put<IConfigGeraisForm>(`${this.configApi}`, config).pipe(
                      catchError(err => this.errorHandler.handleError(err))
                  );
  }

}
