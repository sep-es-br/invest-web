import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { IHttpError } from '../interfaces/http-error.interface';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = sessionStorage.getItem('token');

  if(token) {
    const reqClone = req.clone({
       
      headers: req.headers.set(
        'Authorization',
        `Bearer ${sessionStorage.getItem('token')}`
      ).set(
        'Origin-URL',
        inject(Router).url
      ),
    });

    
  
    return next(reqClone);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        const toastr = inject(ToastrService);
        const router = inject(Router);

        const backEndError = (error.error ?? {}) as Partial<IHttpError>;
        const errorCode = error.status;

        switch (errorCode) {
          case 403:
            toastr.error(backEndError?.mensagem ?? 'Acesso negado');
            break;

          case 401:
            toastr.error(
              backEndError?.erros?.[0] ?? 'Não autorizado',
              backEndError?.mensagem
            );
            sessionStorage.removeItem('token');
            router.navigateByUrl('login');
            break;

          case 501:
            toastr.warning(backEndError?.mensagem ?? 'Operação não implementada');
            break;

          default:
            toastr.error(
              backEndError?.mensagem ?? `Ocorreu um erro desconhecido: ${errorCode}`
            );
            break;
        }

        return throwError(() => error);
    })
  );
};
