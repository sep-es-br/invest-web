import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { IHttpError } from '../interfaces/http-error.interface';
import { Observable, throwError } from 'rxjs';


/**
 * @service
 * Serviço para tratar erros de HTTP dentro do sistema. Recolhe erros e utiliza um serviço de toast (`ToastService`) para oferecer feedback ao usuário.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {


  private router = inject(Router);
  /**
   * @public
   * Método público invocado dentro dos métodos apropriados dos serviços (ex: `getProjeto` dentro de `ProjetosService`).
   *
   * Cria um toast pelo serviço `ToastService` com as informações provenientes do mapa `ToastErrorInfoMap`. Caso o erro não esteja mapeado,
   * apenas registra o erro no console.
   *
   * Ao momento que o toast expirar ou ser fechado pelo usuário,
   * recebe notificação do `Subject` do serviço e executa métodos opcionais de acordo com o erro, providos em `_handleErrorOptions`.
   *
   * @param {HttpErrorResponse} error - O erro fornecido pelo seletor do operador RxJS `catchError`.
   */
  public handleError(error: HttpErrorResponse): Observable<never> {
    const backEndError: IHttpError = error.error;

    const errorCode = backEndError.codigo;

    switch (errorCode) {
      case 401:
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('login');
        break;
      case 403:
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('login');
        break;
      default:
        break;
    }

    return throwError(() => error)
  }
}
