import { GrupoDTO } from "../../../../../../utils/models/GrupoDTO";
import { IOrgaoDTO } from "../../../../../../utils/models/OrgaoDTO";
import { IPapelDTO } from "../../../../../../utils/models/PapelDto";
import { ISetorDTO } from "../../../../../../utils/models/SetorDTO";
import { UnidadeOrcamentariaDTO } from "../../../../../../utils/models/UnidadeOrcamentariaDTO";

export interface ICadastroMembroForm {
    grupo? : GrupoDTO;
    orgao : IOrgaoDTO,
    setor : ISetorDTO,
    papel : IPapelDTO;
}