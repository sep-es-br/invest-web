import {Component} from '@angular/core';
import {Router} from '@angular/router';

import { IProfile } from '../utils/interfaces/profile.interface';
import { ProfileService } from '../utils/services/profile.service';


@Component({
  selector: 'ngx-infoplan-auth-redirect',
  standalone: false,
  template: ''
})
export class AuthRedirectComponent {
  constructor(
    private _router: Router,
    private _profileService: ProfileService
  ) {
    const tokenQueryParamMap =
      this._router.getCurrentNavigation().initialUrl.queryParamMap;

    if (tokenQueryParamMap.has('token')) {
      sessionStorage.setItem(
        'token',
        atob(tokenQueryParamMap.get('token') as string)
      );
    }

    this._profileService
      .getUserInfo().subscribe((response: IProfile) => {
        const infoplanToken = response.token;
        const userProfile = {
          sub: response.sub,
          name: response.name,
          nomeCompleto: response.nomeCompleto,
          email: response.email,
          role: response.role,
        };

        sessionStorage.setItem('token', infoplanToken);
        sessionStorage.setItem('user-profile', JSON.stringify(userProfile));

        this._profileService.userListener.next(response)

        this._router.navigate(['home']);
      });
  }
}
