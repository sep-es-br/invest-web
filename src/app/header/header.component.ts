import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
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
import { concat, tap } from "rxjs";

@Component({
    selector: 'spo-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss',
    standalone: true,
    imports: [CommonModule, BreadCrumbComponent]
})
export class HeaderComponent implements OnInit {

    @ViewChild('menuUser') private menuUserElem? : ElementRef;

    title = '';
    userName : string | undefined = 'Diego Gaede'
    iniciais : string | undefined = 'DG';
    userImage : SafeResourceUrl;

    debounceMenu = false;
    
    qtObjetos = 0;

    showMenuUser : boolean = false;

    permissaoAdm = false;

    @Input() home : HomeComponent;

    @Input() user : IProfile;

    constructor(private route : ActivatedRoute, private router : Router, private dataUtilService : DataUtilService,
        private objetoService: ObjetosService, private permissaoService : PermissaoService) {
        this.dataUtilService.headerUpdate.subscribe(value => this.updateTitle())
        
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.updateTitle();
            }
        })

        let filtro : InvestimentoFiltro = {
            exercicio: "2024",
            nome: "",
            numPag: 1,
            qtPorPag: 15
        }
        
        

        concat(
            this.objetoService.getQuantidadeItens(filtro).pipe(tap(quantidade => {
                this.qtObjetos = quantidade;
            })),
            this.permissaoService.usuarioTemAcesso("administracao").pipe(tap(temAcesso => {
                this.permissaoAdm = temAcesso
            }))
        ).subscribe();

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

        // this.dataUtilService.obsNomeTela.subscribe(nomeTela => {
        //     if(nomeTela)
        //         this.title = nomeTela;
        //     else
        //         this.title = breadCrumbNames[String(pathName)] ?  : String(pathName) ;
        // })
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        if(this.debounceMenu){ 
            this.debounceMenu = false;
            return
        }

        this.toggleMenuUser(false);

        this.debounceMenu = false
    }

    toggleMenuUser(newState : boolean){
        let menuUser = this.menuUserElem.nativeElement as HTMLDivElement;
        
        this.debounceMenu = true

        if(newState) {
            menuUser.style.height = `${menuUser.scrollHeight}px`;
        } else {
            menuUser.style.height = '0'
        }

        this.showMenuUser = newState
    }

    redirectTo(url : string){
        this.router.navigateByUrl(url);
    }

    logout(){
        
        sessionStorage.removeItem('token');

        this.router.navigateByUrl('login');
        
    }

    ngOnInit(): void {
        this.iniciais = this.user.nomeCompleto.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    }

    updateUserInfo(){
        if(this.user.imgPerfil){
            this.userImage = this.dataUtilService.imageFromBase64(this.user.imgPerfil.blob);
        } else {
            this.iniciais = this.user.nomeCompleto.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
        }
    }

}