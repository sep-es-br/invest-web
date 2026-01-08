import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { IDoUnload } from "./DoUnload.interface";

@Injectable({providedIn: 'root'})
export class UnloadGuard implements CanDeactivate<IDoUnload> {

    canDeactivate(component: IDoUnload, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return component.unload();
    }

}