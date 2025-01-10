import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/interceptors/auth.interceptor';
import { provideEnvironmentNgxMask } from "ngx-mask";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEnvironmentNgxMask(),
    provideAnimations(),
    provideToastr({
      disableTimeOut: 'extendedTimeOut',
      progressBar: true,
      positionClass: 'toast-top-center',
      preventDuplicates:true,
      resetTimeoutOnDuplicate: true
    })
  ]
};
