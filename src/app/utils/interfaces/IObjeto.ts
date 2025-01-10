import { ICusto } from "../../home/carteira/objetos/cadastro/exercicio-cadastro.interface";
import { LocalidadeDTO } from "../models/LocalidadeDTO";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { IAreaTematica } from "./IAreaTematica";
import { ITipoPlano } from "./ITipoPlano";
import { IProfile } from "./profile.interface";

export interface IObjeto {
    id?: string;
    tipoConta?: string;
    tipo?: string;
    nome?: string;
    descricao?: string;
    unidade?: UnidadeOrcamentariaDTO;
    planoOrcamentario?: PlanoOrcamentarioDTO;
    microregiaoAtendida?: LocalidadeDTO;
    infoComplementares?: string;
    planos? : ITipoPlano[];
    contrato? : string;
    areaTematica? : IAreaTematica;
    objContratado?: boolean;
    audienciaPublica?: boolean;
    estrategica?: boolean;
    cti?: boolean;
    climatica?: boolean;
    pip?: boolean;
    recursosFinanceiros? : ICusto[];
    responsavel? : IProfile
}