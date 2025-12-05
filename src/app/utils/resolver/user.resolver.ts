import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { IProfile } from "../interfaces/profile.interface";
import { ProfileService } from "../services/profile.service";
import { firstValueFrom, tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserResolver implements Resolve<IProfile> {
    constructor(
        private profileSrv : ProfileService
    ){}
    
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return await firstValueFrom(this.profileSrv.getUser().pipe(
            tap(user => {this.profileSrv.sessionProfile$.set(user)})
        )) ;
    }
}