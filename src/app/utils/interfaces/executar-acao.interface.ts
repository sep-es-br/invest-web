import { IAcao } from "./acao.interface";
import { IApontamento } from "./apontamento.interface";
import { IObjeto } from "./IObjeto";
import { IObjetoCadastroForm } from "./objeto-cadastro-form.interface";
import { IObjetoDetail } from "./objetoDetail.interface";
import { IParecer } from "./parecer.interface";

interface IExecutarBase {
    acao : IAcao,    
    objeto : IObjetoCadastroForm
}

interface IExecutarApontamentos extends IExecutarBase {
    apontamentos : IApontamento[]
}

interface IExecutarParecer extends IExecutarBase {
    parecer : IParecer
}

export type IExecutarAcao = IExecutarApontamentos | IExecutarParecer