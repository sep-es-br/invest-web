import { NgModule } from "@angular/core";
import { Route, Router, RouterModule } from "@angular/router";
import { ObjetosListagemComponent } from "./listagem/objetos-listagem.component";
import { ObjetoCadastroComponent } from "./cadastro/objeto-cadastro.component";

const routes : Route[] = [
    {
        path: "",
        pathMatch: "full",
        component: ObjetosListagemComponent
    },{
        path: "novo",
        component: ObjetoCadastroComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarteiraObjetosRouting {

}