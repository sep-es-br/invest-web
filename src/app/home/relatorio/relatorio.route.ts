import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { RelatorioDetalhadoComponent } from "./consolidado/relatorio-detalhado.component";

const routes : Route[] = [
    {
        path: 'detalhado',
        component: RelatorioDetalhadoComponent
    }, {
        path: '',
        pathMatch: "full",
        redirectTo: "consolidado"
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RelatorioModule {

}