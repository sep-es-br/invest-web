import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, OnInit, Signal, ViewChild, signal } from '@angular/core';
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
import { animate, style, transition, trigger } from "@angular/animations";
import { isMobile } from "../utils/funcoes-util";
import { OverlayDirective } from "../utils/directive/overlay.directive";
import { ProgressSpinner } from "primeng/progressspinner";
import { LoadingService } from '../utils/services/loading.service.service';

@Component({
    selector: 'spo-home',
    templateUrl: 'home.component.html',
    styleUrl: 'home.component.scss',
    imports: [
    CommonModule,
    HeaderComponent,
    RouterOutlet,
    MenuComponent,
    HomeRoutingModule,
    OverlayDirective,
    ProgressSpinner
],
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({'width': '0'}),
                animate('500ms ease-in', style({'width': '*'}))
            ]),
            transition(':leave', [
                style({'width': '*'}),
                animate('500ms ease-out', style({'width': '0'}))
            ])
        ])
    ]
})
export class HomeComponent implements OnInit, AfterViewInit{
    
    menuItemsSignal : Signal<IItemMenu[]>;

    objsNoFluxo : number;
    temAcessoAdm : boolean;
    exibirMenu = false;
    isMobile = isMobile();
    loaded = true;

    loading : Signal<boolean>

    constructor(
        private dataUtilSrv : DataUtilService,
        private activatedRouter : ActivatedRoute,
        private loadingSrv : LoadingService
    ){
        this.menuItemsSignal = this.dataUtilSrv.menuItemnsSignal;
        this.loading = this.loadingSrv.carregando
    }

    mostrarMenu = () => {
        if(isMobile()) return;

        this.exibirMenu = true;
    }
    ocultarMenu = () =>  {
        if(!isMobile()) return;

        this.exibirMenu = false;
    }

    ngOnInit(): void {
        
        this.activatedRouter.data.subscribe(({qtNoFluxo, temAcessoAdm}) => {
            this.objsNoFluxo = qtNoFluxo
            this.temAcessoAdm = temAcessoAdm;
        });

    }

    ngAfterViewInit(): void {
        setTimeout(() => this.loaded = false, 500);
    }

}