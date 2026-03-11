import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-dropdown',
  templateUrl: './label-dropdown.component.html',
  styleUrls: ['./label-dropdown.component.scss']
})
export class LabelDropdownComponent {

  @Input() selectedLabel: string = '';
  @Input() items: string[] = [];

  open = false;

  toggle() {
    this.open = !this.open;
  }

}