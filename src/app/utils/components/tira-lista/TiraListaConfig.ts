import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const LARGURA_FUNC = "2rem";
export const LARGURA_ACAO = "5rem";

export class TiraRecord<T> {
    dado: T;
    config: TiraListaCol<T>[];
    aberto: boolean = false;
    filhos: TiraRecord<any>[]

    console = console;

    constructor(init: Partial<TiraRecord<T>>) {
        Object.assign(this, init);
    }
    
    getValue(colConfig: TiraListaCol<T>) {
        let out = this.dado;
      
        for(let loc of colConfig.caminhoValor.split('.')) {
            out = out?.[loc]
        }

        return out ?? colConfig.valorDefault;
    }
}

export class TiraListaCol<T> {
    titulo: string;
    caminhoValor: string;
    private _largura:string;
    tipo: "propriedade" | "propLongo" | "propDinheiro" | 'acao' | 'botao' | 'avatar' = "propriedade"
    opcoes: {
      icon?: IconDefinition, 
      label: string,
      tipo? : 'positivo' | 'negativo';
      acao: (evt:MouseEvent, data: T, index: number) => void
    }[];
    valorDefault?: any;

    constructor(init: Partial<TiraListaCol<T>>) {
        Object.assign(this, init);
    }

    get largura() {
        if(this._largura) return this._largura;

        switch(this.tipo) {
            case 'acao':
                return LARGURA_ACAO;
            case 'botao':
            case 'avatar':
                return 'min-content';
            default: return '1fr';
        }
    }

    set largura(vlr: string) {
        this._largura = vlr;
    }

}

export const DEFAULT_OPENCLOSE_ACTION = (item) => item.aberto = !item.aberto;