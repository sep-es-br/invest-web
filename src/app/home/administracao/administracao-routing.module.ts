import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { EmConstrucaoComponent } from "../../em-construcao/em-construcao.component";
import { AdminMenuComponent } from "./menu/admin-menu.component";

const routes : Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: AdminMenuComponent
    }, {
        path: 'grupo',
        loadChildren: () => import("./grupos/grupo-routing.module").then(m => m.GrupoRoutingModule)
    }, {
        path: 'pessoas',
        component: EmConstrucaoComponent
    }, {
        path: 'fluxos',
        component: EmConstrucaoComponent
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class AdministracaoRoutingModule {}