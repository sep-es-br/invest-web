import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { opcoesMenuAdm } from "./itensMenu";
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { concat, forkJoin, Observable, tap } from "rxjs";
import { PermissaoService } from "../../../utils/services/permissao.service";

@Component({
    templateUrl: "./admin-menu.component.html",
    styleUrl: "./admin-menu.component.scss",
    imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule]
})
export class AdminMenuComponent {
    searchIcon = faMagnifyingGlass;
    opcoesMenuAdmin = opcoesMenuAdm;

    txtBusca = new FormControl(null);

    temAcesso : {[index:string]: boolean} = {}

    constructor(private router : Router, private permissaoService : PermissaoService) {
        
        let temAcessoObs : {[index:string]: Observable<boolean>} = {}
        
        this.opcoesMenuAdmin.forEach(opcao => {
            if(opcao.caminho !== "")
                temAcessoObs[opcao.caminho] = this.permissaoService.usuarioTemAcesso(opcao.caminho.slice(1))
            
                
        })

        forkJoin(temAcessoObs).subscribe(
            objAcesso => this.temAcesso = objAcesso
        );
    }

    redirectTo(path : string){
        this.router.navigateByUrl(`home/administracao${path}`);
    }
}