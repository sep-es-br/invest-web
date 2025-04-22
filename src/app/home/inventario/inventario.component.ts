import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
    selector: 'spo-inventario',
    template: '<router-outlet></router-outlet>',
    imports: [RouterOutlet]
})
export class InventarioComponent {

}