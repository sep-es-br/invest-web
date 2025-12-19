import { Route, RouterModule } from "@angular/router";
import { EmConstrucaoComponent } from "../../em-construcao/em-construcao.component";
import { NgModule } from "@angular/core";
import { ObjetosListagemComponent } from "./objetos/listagem/objetos-listagem.component";
import { AudienciaPublicaListagemComponent } from "./audiencia-publica/listagem/audiencia-publica-listagem.component";
import { InvestimentosComponent } from "./investimentos/investimentos.component";

const routes : Route[] = [
    {
        path: "investimentos",
        component: InvestimentosComponent
    },
    {
        path: "objetos",
        loadChildren: () => import("./objetos/objetos.routing").then(m => m.CarteiraObjetosRouting)
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "objetos"
    },
    {
        path: 'audiencia-publica',
        component: AudienciaPublicaListagemComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarteiraRoutingModule {

}