import { Observable } from "rxjs";

export interface IDoUnload {
    unload: () => boolean | Observable<boolean>;
}