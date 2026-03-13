import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-label-dropdown',
  templateUrl: './label-dropdown.component.html',
  styleUrls: ['./label-dropdown.component.scss'],
  imports: [CommonModule, NgTemplateOutlet],
  animations: [
    trigger('openClose', [
      transition(':enter', [style({height: 0}), animate('300ms', style({height: '*'}))]),
      transition(':leave', [animate('300ms', style({height: '0'}))])
    ])
  ]
})
export class LabelDropdownComponent {

  @Input() items: any[] = [];

  @ContentChild('item', {static: true}) item : TemplateRef<any>
  @ContentChild('itemList', {static: true}) itemList : TemplateRef<any>

  open = false;

  toggle() {
    this.open = !this.open;
  }

  get outros() : any {
    return this.items.slice(1);
  }

}