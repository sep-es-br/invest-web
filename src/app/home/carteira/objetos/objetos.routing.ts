import { NgModule } from "@angular/core";
import { Route, Router, RouterModule } from "@angular/router";
import { ObjetosListagemComponent } from "./listagem/objetos-listagem.component";
import { ObjetoCadastroComponent } from "./cadastro/objeto-cadastro.component";
import { ObjetosVizualizarComponent } from "./vizualizar/objetos-vizualizar.component";

const routes : Route[] = [
    {
        path: "",
        pathMatch: "full",
        component: ObjetosListagemComponent
    },{
        path: "novo",
        component: ObjetoCadastroComponent
    },{
        path: ":objetoId",
        children: [
            {
                path: "",
                pathMatch: "full",
                component: ObjetosVizualizarComponent
            },{
                path: "edit",
                component: ObjetoCadastroComponent
            }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarteiraObjetosRouting {

}