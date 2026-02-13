import { FonteOrcamentariaDTO } from "../models/FonteOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { ITipoPlano } from "./ITipoPlano"

export interface IObjetoCadastroForm {
    id: number;
    tipoConta: string;
    tipo: string;
    hashProposta: string;
    nome : string;
    descricao: string;
    microregiaoId: number;
    infoComplementares: string;
    planos: ITipoPlano[];
    contrato: string ;
    areaTematicaId: number;
    recursos: ICusto[];
    planoOrcamentario: PlanoOrcamentarioDTO,
    unidadeOrcamentaria: UnidadeOrcamentariaDTO,
    possuiOrcamento: string 
}

export interface ICusto {
    ano: number;
    valoresFontes: IValoresFonte[];
}

export interface IValoresFonte {
    fonte: FonteOrcamentariaDTO;
    planejado: number;
    contratado: number;
}