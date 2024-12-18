import { Route, RouterModule } from "@angular/router";
import { MeuPerfilComponent } from "./meu-perfil.component";
import { NgModule } from "@angular/core";
import { PerfilComponent } from "./perfil/perfil.component";
import { EmConstrucaoComponent } from "../../em-construcao/em-construcao.component";
import { EditarPerfilComponent } from "./perfil/editar-perfil/editar-perfil.component";
import { MeuPerfilGruposComponent } from "./grupos/grupos.component";

const routers : Route[] = [
    {
        path: 'detalhe',
        component: PerfilComponent
    },{
        path: 'detalhe/editar',
        component: EditarPerfilComponent
    },{
        path: 'grupos',
        component: MeuPerfilGruposComponent
    },{
        path: '',
        pathMatch: 'full',
        redirectTo: 'detalhe'
    }
]

@NgModule({
    imports: [RouterModule.forChild(routers)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule {

}