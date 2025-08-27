import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { IHttpError } from "./interfaces/http-error.interface";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  
  constructor(
    private injector : Injector
  ){
    super();

  }

  private get router() : Router {
    return this.injector.get(Router)
  }

  private get toastr() : ToastrService {
    return this.injector.get(ToastrService);
  }


  mensagemDebounce = false;

    override handleError(error: any): void {

        if(!(error instanceof HttpErrorResponse)) super.handleError(error);

        const backEndError: IHttpError = error.error;

        const errorCode = error.status;

        switch (errorCode) {
            case 403:
            this.toastr.error(backEndError.mensagem)
            break;
            case 401:
            this.toastr.error(backEndError.erros[0], backEndError.mensagem)
            sessionStorage.removeItem('token');
            this.router.navigateByUrl('login');
            break;
            
            case 501:
            this.toastr.warning(backEndError.mensagem);
            break;
            default:
            this.toastr.error(backEndError?.mensagem ?? `ocorreu um erro desconhecido: ${errorCode}` );
            break;
        }
        console.error(error);
    }



}