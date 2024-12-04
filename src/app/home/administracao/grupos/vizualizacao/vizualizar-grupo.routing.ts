import { Route, RouterModule } from "@angular/router";
import { GrupoMembrosComponent } from "./membros/grupo-membros.component";
import { GrupoPermissoesComponent } from "./permissoes/grupo-permissoes.component";
import { NgModule } from "@angular/core";

const routes : Route[] = [
    {
        path: "membros",
        pathMatch: "full",
        component: GrupoMembrosComponent
    } , {
        path: "permissoes",
        component: GrupoPermissoesComponent
    } , {
        path: '',
        pathMatch: 'full',
        redirectTo: 'membros'
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VizualizarGrupoRoutingModule {}