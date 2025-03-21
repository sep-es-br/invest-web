import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
    selector: 'spo-carteira',
    template: '<router-outlet></router-outlet>',
    imports: [CommonModule, RouterModule, RouterOutlet]
})
export class CarteiraComponent {

}