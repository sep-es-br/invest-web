import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { opcoesMenuAdm } from "./itensMenu";
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { concat, Observable, tap } from "rxjs";
import { PermissaoService } from "../../../utils/services/permissao.service";

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

    temAcesso = new Map<string, boolean>();

    constructor(private router : Router, private permissaoService : PermissaoService) {
        let obs : Observable<boolean>[] = [];
        
        this.opcoesMenuAdmin.forEach(opcao => {
            if(opcao.caminho !== "")
                obs.push(this.permissaoService.usuarioTemAcesso(opcao.caminho.slice(1))
                        .pipe(tap(temAcesso => this.temAcesso.set(opcao.caminho, temAcesso))))
        })

        concat(...obs).subscribe();
    }

    redirectTo(path : string){
        this.router.navigateByUrl(`home/administracao${path}`);
    }
}