import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, Signal, ViewChild } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { ActivatedRoute, RouterModule, RouterOutlet } from "@angular/router";
import { IProfile } from "../utils/interfaces/profile.interface";
import { ProfileService } from "../utils/services/profile.service";
import { MenuComponent } from "../menu/menu.component";
import { SwipeDirective } from "../utils/directive/swipe.directive";
import { HomeRoutingModule } from "./home-routing.module";
import { PermissaoService } from "../utils/services/permissao.service";
import { IItemMenu } from "../utils/IItemMenu";
import { DataUtilService } from "../utils/services/data-util.service";
import { of } from "rxjs";

@Component({
    selector: 'spo-home',
    templateUrl: 'home.component.html',
    styleUrl: 'home.component.scss',
    imports: [CommonModule, HeaderComponent, RouterOutlet, MenuComponent, SwipeDirective, HomeRoutingModule],
    hostDirectives: [SwipeDirective]
})
export class HomeComponent implements OnInit{
    
    @ViewChild('divMenu') private divMenuElem : ElementRef;

    menuItemsSignal : Signal<IItemMenu[]>;

    objsNoFluxo : number;

    constructor(
        private dataUtilSrv : DataUtilService,
        private activatedRouter : ActivatedRoute
    ){
        this.menuItemsSignal = this.dataUtilSrv.menuItemnsSignal;
    }

    mostrarMenu = () => {
        if(screen.width > 940) return;

        let divElem = this.divMenuElem.nativeElement as HTMLDivElement;

        divElem.style.transform = `translateX(0)`;
    }
    ocultarMenu = () =>  {
        if(screen.width > 940) return;

        this.divMenuElem.nativeElement.style.transform = '';

    }

    ngOnInit(): void {
        
        this.activatedRouter.data.subscribe(({qtNoFluxo}) => {
            this.objsNoFluxo = qtNoFluxo
        });

    }


}