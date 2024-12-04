import { Route, RouterModule } from "@angular/router";
import { GrupoListaComponent } from "./lista/grupo-lista.component";
import { NgModule } from "@angular/core";
import { VizualizarGrupoComponent } from "./vizualizacao/vizualizar-grupo.component";

const routes : Route[] = [
    {
        path: '',
        pathMatch: "full",
        component: GrupoListaComponent
    },{
        path:":id",
        component: VizualizarGrupoComponent,
        loadChildren: () => import("./vizualizacao/vizualizar-grupo.routing").then(m => m.VizualizarGrupoRoutingModule)
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GrupoRoutingModule {
    
}