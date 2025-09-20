import { CommonModule } from "@angular/common";
import { Component, effect, ElementRef, HostListener, Input, OnInit, Signal, ViewChild } from "@angular/core";
import { BreadCrumbComponent } from "./breadcrumb/breadcrumb.component";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { breadCrumbNames } from "./breadcrumb/breadCrumb-data";
import { HomeComponent } from "../home/home.component";
import { IProfile } from "../utils/interfaces/profile.interface";
import { ProfileService } from "../utils/services/profile.service";
import { DataUtilService } from "../utils/services/data-util.service";
import { SafeResourceUrl } from "@angular/platform-browser";
import { ObjetosService } from "../utils/services/objetos.service";
import { InvestimentoFiltro } from "../utils/models/InvestimentoFiltro";
import { PermissaoService } from "../utils/services/permissao.service";
import { concat, Observable, tap } from "rxjs";
import { ObjetoFiltro } from "../utils/models/ObjetoFiltro";
import { IFiltro } from "../home/inventario/objetos/avaliacao/listagem/objetos-filtro/objetos-filtro.component";
import { EtapaService } from "../utils/services/etapa.service";
import { IObjetoFiltro } from "../utils/interfaces/objetoFiltro.interface";
import { IAvatar } from "../utils/interfaces/avatar.interface";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'spo-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss',
    imports: [CommonModule, BreadCrumbComponent],
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
    userName : string | undefined = 'Diego Gaede'
    iniciais : string | undefined = 'DG';
    userImage : SafeResourceUrl;

    userSignal : Signal<IProfile>;

    debounceMenu = false;
    
    qtObjetos = 0;

    showMenuUser : boolean = false;

    permissaoAdm = false;

    @Input() home : HomeComponent;

    private concat$ : Observable<any>;

    constructor(private route : ActivatedRoute, private router : Router, private dataUtilService : DataUtilService,
        private objetoService: ObjetosService, private permissaoService : PermissaoService, private etapaService : EtapaService,
        private profileSrv : ProfileService
    ) {
        this.dataUtilService.headerUpdate.subscribe(value => this.updateTitle())
        
        this.userSignal = this.profileSrv.sessionProfile$;

        this.etapaService.getDoUsuario().pipe(
            tap(etapa => {
                if(etapa) {
                    let objFiltro : IObjetoFiltro = {
                        etapa: etapa,
                        exercicio: new Date().getFullYear()
                    }

                    objetoService.getQuantidadeItensEmProcessamento(objFiltro).pipe(
                        tap(qt => this.qtObjetos = qt)
                    ).subscribe()
                }
            })
        ).subscribe();
        
        
        concat(
            this.permissaoService.usuarioTemAcesso("administracao").pipe(tap(temAcesso => {
                this.permissaoAdm = temAcesso
            }))
        ).subscribe();

        effect(() => {
            if(this.userSignal()?.imgPerfil){
                this.userImage = this.dataUtilService.imageFromBase64(this.userSignal().imgPerfil.blob);
            } else {
                this.iniciais = this.userSignal()?.nomeCompleto.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
            }
        });

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
        if(this.debounceMenu){ 
            this.debounceMenu = false;
            return
        }

        if(!this.menuUserElem.nativeElement.contains(event.target as HTMLElement))
            this.showMenuUser = false;

        this.debounceMenu = false
    }


    redirectTo(url : string){
        this.router.navigateByUrl(url);
    }

    logout(){
        
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user-profile');

        window.open('https://acessocidadao.es.gov.br/is/connect/endsession', '_self');
        
    }

    ngOnInit(): void {
        
    }

}