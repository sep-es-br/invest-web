import { Injectable } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Injectable({providedIn: "root"})
export class DataUtilService {
    constructor (private domSanitizer : DomSanitizer ) {}
    
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
        return this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/webp;base64,' + base64)
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
    
}
