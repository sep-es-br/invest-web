import { Route, RouterModule } from "@angular/router";
import { FluxosListagemComponent } from "./listagem/fluxos-listagem.component";
import { NgModule } from "@angular/core";
import { FluxoCadastroComponent } from "./cadastro/fluxo-cadastro.component";

const routes : Route[] = [
    {
        path: "",
        pathMatch: "full",
        component: FluxosListagemComponent
    }, {
        path: "novo",
        component: FluxoCadastroComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FluxosRoutingModule {

}