import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { IDataList } from "../interfaces/dataList.interface";
import { IProposta } from "../interfaces/proposta.interface";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { IAreaTematica } from "../interfaces/IAreaTematica";

@Injectable({providedIn: "root"})
export class AudienciaPublicaService {
    
    private readonly url = `${environment.apiUrl}/audiencia-publica`;


    constructor(
        private http : HttpClient
    ){}

    getListagem(
        unidades: UnidadeOrcamentariaDTO[],
        areaTematica: IAreaTematica,
        filtroTexto: string,
        podeVerUnidades: boolean,
        pag: number
    ) : Observable<IDataList<IProposta>> {

        let params: HttpParams = new HttpParams()
                .append('podeVerUnidades', podeVerUnidades)
                .append('pag', pag);

        if(unidades && unidades.length > 0)
            params = params.append('unidadeIds', unidades.map(value => value.id).join(';'))

        if(areaTematica)
            params = params.append('areaTematicaId', areaTematica.id)

        if(filtroTexto)
            params = params.append('filtroTexto', filtroTexto)


        return this.http.get<IDataList<IProposta>>(`${this.url}/listaPropostas`, {params: params} )
    }

    getIdUltimaConferencia() : Observable<number> {
        return this.http.get<{id: number}>(`${this.url}/idUltimaAudiencia`)
                .pipe(
                    map((value) => value.id)
                );
    }
}