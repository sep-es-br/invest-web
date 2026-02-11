import { Injectable, signal } from "@angular/core";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";
import { BehaviorSubject, Subject } from "rxjs";
import { IItemMenu } from "../IItemMenu";
import { IContaDetail, IObjetoTiraSimples } from "../interfaces/conta-detail.interface";
import { IObjetoDetail } from "../interfaces/objetoDetail.interface";

@Injectable({providedIn: "root"})
export class DataUtilService {
    constructor (private domSanitizer : DomSanitizer ) {}

    public editModeListener = new Subject<boolean>();
    public titleInfo : {[index:string] : string} = {};
    public headerUpdate = new Subject<any>();
    public menuItemnsSignal = signal<IItemMenu[]>([]);

    
    public readonly obsNomeTela = new BehaviorSubject(null);


    imageFromBase64(base64 : string) : SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(base64)
    }


    setTitleInfo(infoName : string, info : string) {
        this.titleInfo[infoName] = info;
        this.headerUpdate.next(null)
    }
    
}
