import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { EMPTY, filter, switchMap, tap } from 'rxjs';
import { PermissaoService } from './utils/services/permissao.service';
import { DataUtilService } from './utils/services/data-util.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: '<router-outlet></router-outlet>',
    styles: ':host {height: 100vh}'
})
export class AppComponent {
  title = 'SPO';

  constructor (
    private router : Router, 
    private permissaoSrv : PermissaoService,
    private dataUtilSrv : DataUtilService,
  ) { 

    
    this.router.events.pipe(
      switchMap(e => {
        if(e instanceof NavigationEnd) {
          this.dataUtilSrv.headerUpdate.next(null)
         
           return EMPTY
        
        }
        
        return EMPTY;
        
      })
    ).subscribe()
  }

}
