import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { RelatorioDetalhadoComponent } from "./detalhado/relatorio-detalhado.component";
import { RelatorioConsolidadoComponent } from "./consolidado/relatorio-consolidado.component";

const routes : Route[] = [
    {
        path: 'detalhado',
        component: RelatorioDetalhadoComponent
    }, {
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