import { Injectable } from "@angular/core";
import { IApontamento } from "../interfaces/apontamento.interface";
import { IEtapa } from "../interfaces/etapa.interface";
import { BehaviorSubject, first } from "rxjs";
import { IObjeto } from "../interfaces/IObjeto";

@Injectable({providedIn: "root"})
export class ApontamentoService {

    private readonly apontamentos : IApontamento[] = [
        {
            campo: {
                campoId: 'objetoNome',
                nome: "Nome"
            },
            etapa: undefined,
            grupo: {
                id: '4:fc383081-d980-4806-96e4-58de1e63bb34:10416',
                descricao: undefined,
                icone: undefined,
                membros: undefined,
                nome: undefined,
                permissoes: undefined,
                podeVerTodasUnidades: undefined,
                sigla: undefined
            },
            texto: "Apontamento no nome",
            timestamp: new Date('12/01/2024').toISOString(),
            usuario: {
                nomeCompleto: 'Usuario Teste',
                email: undefined,
                id: undefined,
                imgPerfil: undefined,
                name: undefined,
                papel: undefined,
                role: undefined,
                setor: undefined,
                sub: undefined,
                telefone: undefined,
                token: undefined
            }

        }, {
            campo: {
                campoId: 'objetoNome',
                nome: "Nome"
            },
            etapa: undefined,
            grupo: {
                id: '4:fc383081-d980-4806-96e4-58de1e63bb34:10416',
                descricao: undefined,
                icone: undefined,
                membros: undefined,
                nome: undefined,
                permissoes: undefined,
                podeVerTodasUnidades: undefined,
                sigla: undefined
            },
            texto: "Apontamento no nome mais recente",
            timestamp: new Date('12/05/2024').toISOString(),
            usuario: {
                nomeCompleto: 'Usuario Teste',
                email: undefined,
                id: undefined,
                imgPerfil: undefined,
                name: undefined,
                papel: undefined,
                role: undefined,
                setor: undefined,
                sub: undefined,
                telefone: undefined,
                token: undefined
            }

        }
    ];


    public findByEtapa(objeto : IObjeto) {
        return new BehaviorSubject(this.apontamentos)
        .pipe(first());
    }

}