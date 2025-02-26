import { Route, RouterModule } from "@angular/router";
import { AvaliacaoListagemComponent } from "./listagem/avaliacao-listagem.component";
import { NgModule } from "@angular/core";
import { AvaliacaoVizualizarComponent } from "./vizualizar/avaliacao-vizualizar.component";

const routes : Route[] = [
    {
        path: "",
        pathMatch: "full",
        component: AvaliacaoListagemComponent
    },{
        path: ":objetoId",
        component: AvaliacaoVizualizarComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvaliacaoRoutingModule {

}