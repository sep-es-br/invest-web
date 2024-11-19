import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { EmConstrucaoComponent } from "../../em-construcao/em-construcao.component";

const routes : Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: EmConstrucaoComponent
    }, 

]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class AdministracaoRoutingModule {}