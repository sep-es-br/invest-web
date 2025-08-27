import { IStatus } from "./status.interface"

export interface IEmStatus {
    id : number;
    status : IStatus;
    timestamp : string;
}