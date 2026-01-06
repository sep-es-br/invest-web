import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { EmConstrucaoComponent } from "../../em-construcao/em-construcao.component";
import { AdminMenuComponent } from "./menu/admin-menu.component";
import { PessoasComponent } from "./pessoas/pessoas.component";
import { MeuPerfilComponent } from "../meu-perfil/meu-perfil.component";
import { PerfilComponent } from "../meu-perfil/perfil/perfil.component";
import { MeuPerfilGruposComponent } from "../meu-perfil/grupos/grupos.component";

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
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: PessoasComponent
            }, {
                path: ':id',
                component: MeuPerfilComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'detalhe'
                    }, {
                        path: 'detalhe',
                        component: PerfilComponent
                    }, {
                        path: 'grupos',
                        component: MeuPerfilGruposComponent
                    }
                ]
            }
        ]
    }, {
        path: 'fluxos',
        component: EmConstrucaoComponent
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class AdministracaoRoutingModule {}