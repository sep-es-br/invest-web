import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { RouterModule, RouterOutlet } from "@angular/router";
import { IProfile } from "../utils/interfaces/profile.interface";
import { ProfileService } from "../utils/services/profile.service";
import { MenuComponent } from "../menu/menu.component";
import { SwipeDirective } from "../utils/directive/swipe.directive";
import { HomeRoutingModule } from "./home-routing.module";
import { PermissaoService } from "../utils/services/permissao.service";

@Component({
    selector: 'spo-home',
    templateUrl: 'home.component.html',
    styleUrl: 'home.component.scss',
    standalone: true,
    imports: [CommonModule, HeaderComponent, RouterOutlet, MenuComponent, SwipeDirective, HomeRoutingModule],
    hostDirectives: [SwipeDirective]
})
export class HomeComponent implements OnInit{
    
    @ViewChild('divMenu') private divMenuElem : ElementRef;
    @ViewChild(HeaderComponent) private headerElem : HeaderComponent;

    user : IProfile;

    constructor(
        private readonly profile: ProfileService, private readonly permissaoService : PermissaoService
    ){

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

        this.profile.userListener.subscribe(newUser => {
            this.loadUserDetails(newUser);
        })
        this.loadUser();
    }


    loadUserDetails(user: IProfile) : void {


        if(user) {
            this.user = user;
            this.profile.getAvatarFromLoggedSub().subscribe(avatar => {
                if(avatar === null || avatar.blob === "") return;
                this.user.imgPerfil = avatar;
                this.headerElem.updateUserInfo();

            });
            

        } else {
            this.profile.getUser().subscribe(value => {
                const userProfile = {
                    sub: value.sub,
                    name: value.name,
                    nomeCompleto: value.nomeCompleto,
                    email: value.email,
                    role: value.role,
                };

                sessionStorage.setItem('user-profile', JSON.stringify(userProfile));
                this.loadUserDetails(value);
            });
        }

    }


    loadUser() : void {

        let userJson = sessionStorage.getItem('user-profile');
        this.loadUserDetails(JSON.parse(userJson));
    }
}