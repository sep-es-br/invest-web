import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const ROUTES : Route[] = [
    {
        path: 'avaliacao',
        loadChildren: () => import('./avaliacao/avaliacao.routing').then(m => m.AvaliacaoRoutingModule)
    },{
        path: "",
        pathMatch: "full",
        redirectTo: "avaliacao"
    }
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ObjetosRoutingModule {

}