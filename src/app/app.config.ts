import { ApplicationConfig, ErrorHandler, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/interceptors/auth.interceptor';
import { provideEnvironmentNgxMask } from "ngx-mask";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideEnvironmentNgxCurrency } from 'ngx-currency';
import { GlobalErrorHandler } from './utils/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEnvironmentNgxMask(),
    provideEnvironmentNgxCurrency({prefix: 'R$ ', thousands: '.', decimal: ',', precision: 2, align: 'left'}),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura },
      translation: {
            dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
            monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            today: 'Hoje',
            clear: 'Limpar',
            firstDayOfWeek: 0 // Domingo como primeiro dia
        }
    }),
    provideToastr({
      disableTimeOut: 'extendedTimeOut',
      progressBar: true,
      positionClass: 'toast-top-center',
      preventDuplicates:true,
      resetTimeoutOnDuplicate: true
    }), { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
