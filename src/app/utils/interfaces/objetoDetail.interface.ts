import { IAlterador } from "./alterador.interface";
import { IEmEtapa } from "./emEtapa.interface";
import { IEmStatus } from "./emStatus.interface";
import { ITipoPlano } from "./ITipoPlano";
import { IRevisor } from "./revisor.interface";

export interface IObjetoDetail {
  new: boolean;


    id: number;
    gnd: number;
    hashProposta: string;
  tipoInvestimento: string;
  tipoObjeto: string;
  nome: string;
  descricao: string;
  codUnidade: string;
  siglaUnidade: string;
  responsavel: string;
  microrregiaoId: number;
  microrregiaoNome: string;
  infoComplementar: string;
  codPlano: string;
  nomePlano: string;
  idArea: number;
  nomeArea: string;
  tiposPlano: ITipoPlano[];
  emEtapa: IEmEtapa[];
  emStatus: IEmStatus;
  contrato: string;
  possuiOrcamento: string;
  /**
   * custos: Map<Ano, Map<CodigoFonte, Custo>>
   * Representado em JSON como:
   * {
   *   "2025": {
   *     "1234": { planejado: 100.0, contratado: 80.0 }
   *   }
   * }
   */
  custos: Record<number, Record<string, ICusto>>;
  timestamp: string;
  revisor: IRevisor[];
  alterador: IAlterador[];
}

export interface ICusto {
  planejado: number;
  contratado: number;
}
