import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { MenuLink } from "../utils/menuLinks";
import { RouterLink } from "@angular/router";


@Component({
    selector: 'spo-menu',
    templateUrl: 'menu.component.html',
    styleUrl: 'menu.component.scss',
    standalone: true,
    imports: [CommonModule, RouterLink]
})
export class MenuComponent {
    menuItems = MenuLink;

    private readonly showDivClass = 'showDiv';
    private debounce = false;

    @ViewChild("nav")
    navDiv!: ElementRef;

    
    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        
        if(this.debounce){
            this.debounce = false;
            return
            
        }

        let divSub = (this.navDiv.nativeElement as HTMLDivElement).querySelectorAll(`.${this.showDivClass}`);

        if(divSub.length == 0) return

        divSub.forEach(elem => {
            elem.classList.remove(this.showDivClass);
        })
    }

    toggleSub(index : number) : void {
        this.debounce = true;
        let divSub = (this.navDiv.nativeElement as HTMLDivElement).querySelector("#sub" + index);
        if(!divSub) return

        if(divSub.classList.contains(this.showDivClass)) {
            divSub.classList.remove(this.showDivClass);
        } else {
            divSub.classList.add(this.showDivClass);
        }

    }

}