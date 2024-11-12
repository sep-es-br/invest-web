import { Route, RouterModule } from "@angular/router";
import { InvestimentosComponent } from "./investimentos/investimentos.component";
import { NgModule } from "@angular/core";
import { ObjetosComponent } from "./objetos/objetos.component";

const routes : Route[] = [
    {
        path: 'investimentos',
        component: InvestimentosComponent
    }, {
        path: "objetos",
        component: ObjetosComponent,
        loadChildren: () => import("./objetos/objetos-routing.module").then(m => m.ObjetosRoutingModule)
    },{
        path: '', pathMatch: "full", redirectTo: 'investimentos'
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventarioRoutingModule {}