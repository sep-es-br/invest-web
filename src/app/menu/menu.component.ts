import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ItemMenuComponent } from "./item-menu/item-menu.component";
import { PermissaoService } from "../utils/services/permissao.service";
import { IItemMenu } from "../utils/IItemMenu";
import { Router } from "@angular/router";

@Component({
  selector: 'spo-menu',
  templateUrl: 'menu.component.html',
  styleUrl: 'menu.component.scss',
  standalone: true,
  imports: [CommonModule, ItemMenuComponent]
})
export class MenuComponent implements OnInit {
  @Output() menuButtonClicked = new EventEmitter<any>();

  public itensMenu : IItemMenu[];

  constructor(
      private permissaoService : PermissaoService,
      private router : Router
  ) {        
      // this.itensMenu = menuLinks.filter(item => item.ativo);
  }

  ngOnInit(): void {
    if(sessionStorage.getItem("user-profile")) {
      this.permissaoService.updateMenuSignal.subscribe(
        () => { 
          this.permissaoService.buildMenu().subscribe(menuList => {
            this.itensMenu = menuList.filter(item => item.ativo);
          });
        }
      );

      this.permissaoService.updateMenuSignal.next(null);
    }
  }

  navegarPara(path : string) {
    this.router.navigateByUrl(path);
  }
}