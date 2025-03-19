import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
    selector: 'spo-objetos',
    template: '<router-outlet></router-outlet>',
    imports: [CommonModule, RouterOutlet]
})
export class ObjetosComponent {}