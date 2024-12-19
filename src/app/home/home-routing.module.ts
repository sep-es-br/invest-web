import { Route, RouterModule } from "@angular/router";
import { InventarioComponent } from "./inventario/inventario.component";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { CarteiraComponent } from "./carteira/carteira.component";
import { MeuPerfilComponent } from "./meu-perfil/meu-perfil.component";
import { InicioComponent } from "./inicio/inicio.component";

const routes : Route[] = [
     {
        path: "inventario",
        component: InventarioComponent,
        loadChildren: () => import('./inventario/inventario-routing.module').then( m => m.InventarioRoutingModule)
    },{
        path: "carteira",
        component: CarteiraComponent,
        loadChildren: () => import('./carteira/carteira-routing.module').then( m => m.CarteiraRoutingModule)
    },{
        path: "meuperfil",
        component: MeuPerfilComponent,
        loadChildren: () => import('./meu-perfil/meu-perfil-routing.module').then( m => m.UsuarioRoutingModule)
    },{
        path: "administracao",
        loadChildren: () => import('./administracao/administracao-routing.module').then( m => m.AdministracaoRoutingModule)
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