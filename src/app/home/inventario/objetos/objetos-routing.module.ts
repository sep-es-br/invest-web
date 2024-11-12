import { Route, RouterModule } from "@angular/router";
import { AvaliacaoComponent } from "./avaliacao/avaliacao.component";
import { NgModule } from "@angular/core";

const ROUTES : Route[] = [
    {
        path: 'avaliacao',
        component: AvaliacaoComponent
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