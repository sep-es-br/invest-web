import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { IHttpError } from '../interfaces/http-error.interface';
import { EMPTY, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


/**
 * @service
 * Serviço para tratar erros de HTTP dentro do sistema. Recolhe erros e utiliza um serviço de toast (`ToastService`) para oferecer feedback ao usuário.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {

  constructor(
    private router:Router, 
    private toastr:ToastrService
  ){}

  mensagemDebounce = false;

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
        case 403:
          this.toastr.error(backEndError.mensagem)
          break;
        case 401:
          this.toastr.error(backEndError.erros[0], backEndError.mensagem)
          sessionStorage.removeItem('token');
          this.router.navigateByUrl('login');
          break;
        default:
          this.toastr.error("aconteceu um erro desconhecido, favor verificar a conexão com a internet ou falar com um Administrador");
          break;
      }
    

    return EMPTY;
  }
}
