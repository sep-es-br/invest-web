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
        component: VizualizarGrupoComponent
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GrupoRoutingModule {
    
}