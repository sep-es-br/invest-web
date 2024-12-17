import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Router } from "@angular/router";
import { IItemMenu } from "../../utils/IItemMenu";

@Component({
    selector: "spo-item-sub-menu",
    standalone: true,
    templateUrl: "./item-sub-menu.component.html",
    styleUrl: "./item-sub-menu.component.scss",
    imports: [CommonModule, FontAwesomeModule]
})
export class ItemSubMenuComponent {

    @Input() item : IItemMenu;
    @Input() parentPath : string;

    marcadorIcon = faCircle;

    constructor(
        private router : Router
    ){}

    @HostListener("click", ["$event"])
    clickEvent(evento : MouseEvent) {
        if(!this.item.subItens)
            this.router.navigateByUrl(this.parentPath + this.item.link);
    }

}