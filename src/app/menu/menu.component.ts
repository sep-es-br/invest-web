import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
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

    @ViewChild("nav")
    navDiv!: ElementRef;

    toggleSub(index : number) : void {
        const showDivClass = 'showDiv'

        let divSub = (this.navDiv.nativeElement as HTMLDivElement).querySelector("#sub" + index);
        if(!divSub) return

        if(divSub.classList.contains(showDivClass)) {
            divSub.classList.remove(showDivClass);
        } else {
            divSub.classList.add(showDivClass);
        }

    }

}