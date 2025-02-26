import { IStatus } from "./status.interface"

export interface IEmStatus {
    id : string;
    status : IStatus;
    timestamp : string;
}