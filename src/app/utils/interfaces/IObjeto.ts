import { ICusto } from "../../home/carteira/objetos/cadastro/exercicio-cadastro.interface";
import { LocalidadeDTO } from "../models/LocalidadeDTO";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { IAreaTematica } from "./IAreaTematica";
import { IConta } from "./IConta";
import { ITipoPlano } from "./ITipoPlano";
import { IProfile } from "./profile.interface";

export interface IObjeto {
    id?: string;
    tipoConta?: string;
    tipo?: string;
    nome?: string;
    descricao?: string;
    microregiaoAtendida?: LocalidadeDTO;
    infoComplementares?: string;
    planos? : ITipoPlano[];
    contrato? : string;
    areaTematica? : IAreaTematica;
    recursosFinanceiros? : ICusto[];
    responsavel? : IProfile, 
    conta : IConta
}