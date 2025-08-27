import { Injectable } from "@angular/core";
import { IApontamento } from "../interfaces/apontamento.interface";
import { IEtapa } from "../interfaces/etapa.interface";
import { BehaviorSubject, first } from "rxjs";
import { IObjeto } from "../interfaces/IObjeto";
import { IProfile } from "../interfaces/profile.interface";
import { GrupoDTO } from "../models/GrupoDTO";
import { ICampo } from "../interfaces/campo.interface";

@Injectable({providedIn: "root"})
export class ApontamentoService {

    private readonly apontamentos : IApontamento[] = [
        {
            campo: {
                campoId: 'objetoNome',
                nome: "Nome"
            },
            grupo: {
                id: 2
            } as GrupoDTO,
            texto: "Apontamento no nome",
            timestamp: new Date('12/01/2024').toISOString(),
            usuario: {
                nomeCompleto: 'Usuario Teste'
            } as  IProfile

        } as IApontamento, {
            campo: {
                campoId: 'objetoNome',
                nome: "Nome"
            } as ICampo,
            grupo: {
                id: 1
            } as GrupoDTO,
            texto: "Apontamento no nome mais recente",
            timestamp: new Date('12/05/2024').toISOString(),
            usuario: {
                nomeCompleto: 'Usuario Teste',
            } as IProfile

        } as IApontamento
    ];


    public findByEtapa(objeto : IObjeto) {
        return new BehaviorSubject(this.apontamentos)
        .pipe(first());
    }

}