import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { PermissaoService } from "../services/permissao.service";

export const TemAcessoResolver : ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {

    const permissaoSrv = inject(PermissaoService);
    const {pathId} = route.data;

    return permissaoSrv.usuarioTemAcesso(pathId);
}