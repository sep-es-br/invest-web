import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ItemMenuComponent } from "./item-menu/item-menu.component";
import { PermissaoService } from "../utils/services/permissao.service";
import { IItemMenu } from "../utils/IItemMenu";
import { Router } from "@angular/router";
import { Observable } from "rxjs";


@Component({
    selector: 'spo-menu',
    templateUrl: 'menu.component.html',
    styleUrl: 'menu.component.scss',
    imports: [CommonModule, ItemMenuComponent]
})
export class MenuComponent{


    @Input() public itensMenu : IItemMenu[];

    constructor(
        private permissaoService : PermissaoService,
        private router : Router
    ){

    }


    navegarPara(path : string) {
        this.router.navigateByUrl(path);
    }

}