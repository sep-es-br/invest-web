import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { opcoesMenuAdm } from "./itensMenu";
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
    standalone: true,
    templateUrl: "./admin-menu.component.html",
    styleUrl: "./admin-menu.component.scss",
    imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule]
})
export class AdminMenuComponent {
    searchIcon = faMagnifyingGlass;
    opcoesMenuAdmin = opcoesMenuAdm;

    txtBusca = new FormControl(null);

    constructor(private router : Router) {

    }

    redirectTo(path : string){
        this.router.navigateByUrl(`home/administracao${path}`);
    }
}