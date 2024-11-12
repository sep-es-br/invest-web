import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { BreadCrumbComponent } from "./breadcrumb/breadcrumb.component";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { breadCrumbNames } from "./breadcrumb/breadCrumb-data";
import { HomeComponent } from "../home/home.component";
import { IProfile } from "../utils/interfaces/profile.interface";
import { ProfileService } from "../utils/services/profile.service";
import { DataUtilService } from "../utils/services/data-util.service";
import { SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: 'spo-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss',
    standalone: true,
    imports: [CommonModule, BreadCrumbComponent]
})
export class HeaderComponent implements OnInit {

    @ViewChild('menuUser') private menuUserElem? : ElementRef;
    @ViewChild('userImg') private userImgElem : ElementRef;

    title = '';
    userName : string | undefined = 'Diego Gaede'
    iniciais : string | undefined = 'DG';
    userImage : SafeResourceUrl;

    showMenuUser : boolean = false;

    @Input() home : HomeComponent;

    @Input() user : IProfile;

    constructor(private route : ActivatedRoute, private router : Router, private dataUtilService : DataUtilService) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let activeRouter = this.route.snapshot;
                while (activeRouter.children.length > 0) {
                    activeRouter = activeRouter.firstChild ? activeRouter.firstChild : activeRouter;
                }
                
                this.title = breadCrumbNames[String(activeRouter.url)] ? breadCrumbNames[String(activeRouter.url)] :
                  String(activeRouter.url) ;
            }
        })

    }

    toggleMenuUser(){
        let menuUser = this.menuUserElem.nativeElement as HTMLDivElement;
        if(this.showMenuUser) {
            menuUser.style.height = ''
        } else {
            menuUser.style.height = `${menuUser.scrollHeight}px`;
            // menuUser.style.height = `calc(${menuUser.scrollHeight}px + ${window.getComputedStyle(menuUser.querySelector('div')).getPropertyValue('padding')})`;
        }

        this.showMenuUser = !this.showMenuUser
    }

    redirectTo(url : string){
        this.router.navigateByUrl(url);
    }

    logout(){
        
        sessionStorage.removeItem('token');

        this.router.navigateByUrl('login');
        
    }

    ngOnInit(): void {
        this.iniciais = this.user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    }

    updateUserInfo(){
        if(this.user.imgPerfil){
            this.userImage = this.dataUtilService.imageFromBase64(this.user.imgPerfil.blob);
        } else {
            this.iniciais = this.user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
        }
    }

}