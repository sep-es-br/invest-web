import { Injectable } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({providedIn: "root"})
export class DataUtilService {
    constructor (private domSanitizer : DomSanitizer ) {}

    public editModeListener = new Subject<boolean>();
    public titleInfo : {[index:string] : string} = {};
    public headerUpdate = new Subject<any>();
    
    public readonly obsNomeTela = new BehaviorSubject(null);
    
    paginar(arr : any[], maxTam : number) : any[][] {
        let retorno : any[][] = [];
    
        let indexBase = 0;
    
        while (indexBase < arr.length) {
            retorno.push(arr.slice(indexBase, indexBase+maxTam))
            indexBase += maxTam;
        }
    
        return retorno;
    }

    imageFromBase64(base64 : string) : SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(base64)
    }

    fileToBinaryString(file : File) : string {
        
        file.arrayBuffer().then(buffer => {
            let binary = "";
            let bytes = new Uint8Array(buffer);
            for(let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i])
            }

            return binary;
        });
        return null;

        
    }

    setTitleInfo(infoName : string, info : string) {
        this.titleInfo[infoName] = info;
        this.headerUpdate.next(null)
    }
    
}
