import { IProfile } from "../interfaces/profile.interface";
import { IPodeDTO } from "./PodeDto";

export interface GrupoDTO {
    id : string;
    icone : string;
    sigla : string;
    nome : string;
    descricao : string;
    membros : IProfile[];
    permissoes : IPodeDTO[];

}