import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { PermissaoService } from "../services/permissao.service";
import { DataUtilService } from "../services/data-util.service";
import { firstValueFrom, tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class MenuResolver implements Resolve<any> {

    constructor(
        private permissaoSrv : PermissaoService,
        private dataUtilSrv : DataUtilService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        return await firstValueFrom(this.permissaoSrv.buildMenu().pipe(
                    tap((itensMenu) => {
                      this.dataUtilSrv.menuItemnsSignal.set(itensMenu.filter(i => i.ativo))
                    })
                  )); 
    }

}