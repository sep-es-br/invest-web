import { CommonModule } from "@angular/common";
import { Component, effect, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Signal, ViewChild } from "@angular/core";
import { BreadCrumbComponent } from "./breadcrumb/breadcrumb.component";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { breadCrumbNames } from "./breadcrumb/breadCrumb-data";
import { IProfile } from "../utils/interfaces/profile.interface";
import { ProfileService } from "../utils/services/profile.service";
import { DataUtilService } from "../utils/services/data-util.service";
import { SafeResourceUrl } from "@angular/platform-browser";
import { PermissaoService } from "../utils/services/permissao.service";
import { concat, tap } from "rxjs";
import { EtapaService } from "../utils/services/etapa.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { IPodeDTO } from "../utils/models/PodeDto";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "../utils/funcoes-util";

@Component({
    selector: 'spo-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss',
    imports: [CommonModule, BreadCrumbComponent, FontAwesomeModule],
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({height: '0'}),
                animate('300ms ease-in', style({height: '*'}))
            ]),
            transition(':leave', [
                style({height: '*'}),
                animate('300ms ease-out', style({height: '0'}))
            ])
        ])
    ]
})
export class HeaderComponent implements OnInit {

    @ViewChild('menuUser') private menuUserElem? : ElementRef<HTMLElement>;

    title = '';

    menuIcon = faBars;

    userSignal : Signal<IProfile>;
    
    showMenuUser : boolean = false;

    isMobile = isMobile();

    @Input() qtObjetos : number;
    @Input() permissaoAdm : boolean;

    @Output() onMenuClick = new EventEmitter<MouseEvent>();

    constructor(private route : ActivatedRoute, private router : Router, private dataUtilService : DataUtilService,
        private permissaoService : PermissaoService,
        private profileSrv : ProfileService
    ) {
        this.dataUtilService.headerUpdate.subscribe(value => this.updateTitle())
        
        this.userSignal = this.profileSrv.sessionProfile$;
        
        concat(
            this.permissaoService.usuarioTemAcesso("administracao").pipe(tap(temAcesso => {
                this.permissaoAdm = temAcesso
            }))
        ).subscribe();


    }

    get userImage() {
        return this.dataUtilService.imageFromBase64(this.userSignal()?.imgPerfil?.blob)
    }

    get iniciais() {
        return this.userSignal()?.nomeCompleto.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    }

    updateTitle() {
        this.title = ''
        let activeRouter = this.route.snapshot;
        while (activeRouter.children.length > 0 && activeRouter.firstChild.url[0] != undefined) {
            if(activeRouter.routeConfig.path.startsWith(":"))
                this.title = this.dataUtilService.titleInfo[activeRouter.routeConfig.path.slice(1)]

            activeRouter = activeRouter.firstChild ? activeRouter.firstChild : activeRouter;
        }
        
        let pathName = activeRouter.url[activeRouter.url.length-1];
        
        if(breadCrumbNames[String(pathName)]) {
            if(this.title !== '')
                this.title += " - "
            this.title += breadCrumbNames[String(pathName)]
        } else {
            while(activeRouter && !activeRouter.routeConfig.path.startsWith(":"))
                activeRouter = activeRouter.parent;

            this.title = this.dataUtilService.titleInfo[activeRouter.routeConfig.path.slice(1)]
        }

    }

    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        if(!this.menuUserElem) return;
        if(this.debounceMenu){ 
            this.debounceMenu = false;
            return
        }

        if(!this.menuUserElem.nativeElement.contains(event.target as HTMLElement))
            this.showMenuUser = false;
    }


    redirectTo(url : string){
        this.router.navigateByUrl(url);
    }

    logout(){
        
        sessionStorage.removeItem('token');

        window.open('https://acessocidadao.es.gov.br/is/connect/endsession', '_self');
        
    }

    ngOnInit(): void {
        
    }

}