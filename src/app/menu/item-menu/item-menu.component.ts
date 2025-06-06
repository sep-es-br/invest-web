import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { ItemSubMenuComponent } from "../item-sub-menu/item-sub-menu.component";
import { IItemMenu } from "../../utils/IItemMenu";

@Component({
    selector: "spo-menu-item",
    standalone: true,
    templateUrl: "./item-menu.component.html",
    styleUrl: "./item-menu.component.scss",
    imports: [CommonModule, ItemSubMenuComponent]
})
export class ItemMenuComponent implements OnChanges{
  @ViewChild("icone", {read: ElementRef}) public iconeElemRef : ElementRef;

  @Input() public item : IItemMenu

  @Output() menuButtonClicked = new EventEmitter<any>();

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