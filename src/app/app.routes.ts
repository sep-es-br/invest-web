import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';
import { authGuard } from './utils/guard/auth.guard';
import { MenuResolver } from './utils/resolver/menu.resolver';
import { UserResolver } from './utils/resolver/user.resolver';

export const routes: Routes = [
    {
      title: 'SPO',
      path: 'home',
      component: HomeComponent,
      canActivateChild: [authGuard],
      resolve: {menuItem: MenuResolver, user: UserResolver},
      runGuardsAndResolvers: "always",
      loadChildren: () => import('./home/home-routing.module').then(m => m.HomeRoutingModule)
    }, 
    {
      title: 'Autorizando...',
      path: 'token',
      component: AuthRedirectComponent,
    },
    {
      title: 'SPO - Login',
      path: 'login',
      canActivate: [authGuard],
      component: LoginComponent,
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
