import { Route, RouterModule } from "@angular/router";
import { InventarioComponent } from "./inventario/inventario.component";
import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { CarteiraComponent } from "./carteira/carteira.component";

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
        path: "usuario",
        loadChildren: () => import('./usuario/usuario-routing.module').then( m => m.UsuarioRoutingModule)
    },{
        path: "", pathMatch: "full", redirectTo: 'inventario'
    }
]

@NgModule ({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}