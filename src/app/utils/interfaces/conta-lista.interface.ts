export interface IContaLista {
  id: number;
  codUnidade: string;
  siglaUnidade: string;
  codPO: string;
  nome: string;
  tipo: string;
  totalPlanejado: number;
  totalContratado: number;
  totalOrcado: number;
  totalAutorizado: number;
  totalEmpenhado: number;
  totalDisponivel: number;
}