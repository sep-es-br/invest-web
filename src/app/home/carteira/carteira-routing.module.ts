import { Route, RouterModule } from "@angular/router";
import { EmConstrucaoComponent } from "../../em-construcao/em-construcao.component";
import { NgModule } from "@angular/core";
import { ObjetosListagemComponent } from "./objetos/listagem/objetos-listagem.component";

const routes : Route[] = [
    {
        path: "investimentos",
        component: EmConstrucaoComponent
    },{
        path: "objetos",
        loadChildren: () => import("./objetos/objetos.routing").then(m => m.CarteiraObjetosRouting)
    },{
        path: "",
        pathMatch: "full",
        redirectTo: "investimentos"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarteiraRoutingModule {

}