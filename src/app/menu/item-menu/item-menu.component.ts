import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ItemSubMenuComponent } from "../item-sub-menu/item-sub-menu.component";
import { IItemMenu } from "../../utils/IItemMenu";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: "spo-menu-item",
    templateUrl: "./item-menu.component.html",
    styleUrl: "./item-menu.component.scss",
    imports: [CommonModule, ItemSubMenuComponent],
    animations : [
        trigger('openClose',[
            transition(':enter', [
                style({width: '0'}),
                animate('300ms ease-in', style({width: '*'}))
            ]),
            transition(':leave', [
                style({width: '*'}),
                animate('300ms ease-out', style({width: '0'}))
            ])
        ])
    ]
})
export class ItemMenuComponent implements OnChanges{

    @ViewChild("icone", {read: ElementRef}) public iconeElemRef : ElementRef;

    @Input() public item : IItemMenu

    filhos : IItemMenu[]

    aberto = false;

    @HostListener("document:click", ["$event"])
    clickFora (event : MouseEvent) {
        if(!this.iconeElemRef.nativeElement.contains(event.target)) {
            this.aberto = false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.filhos = (changes["item"].currentValue as IItemMenu).subItens.filter(subItem => subItem.ativo)
    }


}