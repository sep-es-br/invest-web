import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

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

  return next(req);
};
