import { Route, RouterModule } from "@angular/router";
import { RelatorioConsolidadoComponent } from "./consolidado/relatorio-consolidado.component";
import { NgModule } from "@angular/core";

const routes : Route[] = [
    {
        path: 'consolidado',
        component: RelatorioConsolidadoComponent
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