import { Route, RouterModule } from "@angular/router";
import { InventarioComponent } from "./inventario/inventario.component";
import { NgModule } from "@angular/core";
import { MeuPerfilComponent } from "./meu-perfil/meu-perfil.component";
import { InicioComponent } from "./inicio/inicio.component";
import { UserResolver } from "../utils/resolver/user.resolver";

const routes : Route[] = [
     {
        path: "inventario",
        component: InventarioComponent,
        loadChildren: () => import('./inventario/inventario-routing.module').then( m => m.InventarioRoutingModule)
    },{
        path: "carteira",
        loadChildren: () => import('./carteira/carteira-routing.module').then( m => m.CarteiraRoutingModule)
    },{
        path: "meuperfil",
        component: MeuPerfilComponent,
        resolve: { user: UserResolver },
        runGuardsAndResolvers: 'always',
        loadChildren: () => import('./meu-perfil/meu-perfil-routing.module').then( m => m.UsuarioRoutingModule)
    },{
        path: "administracao",
        loadChildren: () => import('./administracao/administracao-routing.module').then( m => m.AdministracaoRoutingModule)
    },{
        path: "relatorio",
        loadChildren: () => import('./relatorio/relatorio.route').then( m => m.RelatorioModule)
    },{
        path: "", 
        pathMatch: "full", 
        component: InicioComponent
    }
]

@NgModule ({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}