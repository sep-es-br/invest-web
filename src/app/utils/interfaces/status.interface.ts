import { StatusEnum } from "../enum/status.enum";

export interface IStatus {
    id? : number,
    nome : string,
    statusId: keyof typeof StatusEnum
}