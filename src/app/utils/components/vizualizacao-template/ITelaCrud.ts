import { ISubTelaCrud } from "./ISubTelaCrud";

export interface ITelaCrud {
    telaResumo: any;
    subTelas: ISubTelaCrud[];
}