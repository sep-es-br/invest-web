import { EmConstrucaoComponent } from "../../../../em-construcao/em-construcao.component";
import { ITelaCrud } from "../../../../utils/components/vizualizacao-template/ITelaCrud";
import { GrupoMembrosComponent } from "./membros/grupo-membros.component";
import { GrupoPermissoesComponent } from "./permissoes/grupo-permissoes.component";
import { GrupoResumoComponent } from "./resumo/grupo-resumo.component";

export const vizualizarGrupoConfig : ITelaCrud = {
    telaResumo : GrupoResumoComponent,
    subTelas : [
        {
            nome: "Membros",
            tela: GrupoMembrosComponent
        },{
            nome: "Permissões",
            tela: GrupoPermissoesComponent
        }
    ]
    
}