import { Route, RouterModule } from "@angular/router";
import { MeuPerfilComponent } from "./meu-perfil/meu-perfil.component";
import { NgModule } from "@angular/core";

const routers : Route[] = [
    {
        path: 'meuperfil',
        component: MeuPerfilComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routers)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule {

}