import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export class TiraRecord {
    dado: any;
    config: TiraListaCol[];
    aberto: boolean;
    filhos: TiraRecord[]

    constructor(init: Partial<TiraRecord>) {
        Object.assign(this, init);
    }
    
    getValue(colConfig: TiraListaCol) {
        let out = this.dado;
      
        for(let loc of colConfig.caminhoValor.split('.')) {
            out = out?.[loc]
        }

        return out;
    }
}

export class TiraListaCol {
    titulo: string;
    caminhoValor: string;
    largura:string = "fit-content";
    tipo: "propriedade" | "propLongo" | "propDinheiro" | "toggle" | 'acao' = "propriedade"
    opcoes: {
      icon?: IconDefinition, 
      label: string,
      acao: (evt:any) => void
    }[];

    constructor(init: Partial<TiraListaCol>) {
      Object.assign(this, init);
    }

}