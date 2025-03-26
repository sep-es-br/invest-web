import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IFiltroInvestimento } from "../../home/relatorio/detalhado/investimento-filtro/IFiltroInvestimento";
import { Observable, tap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IDadoConsolidadoFiltro } from "../../home/relatorio/consolidado/investimento-filtro/dado-consolidado-filtro.interface";

@Injectable({providedIn: "root"})
export class RelatorioService {

    private readonly relatorioApi = `${environment.apiUrl}/relatorio`;

    constructor(
        private http : HttpClient
    ){}

    public gerarRelatorio(filtro : Partial<IFiltroInvestimento>) : Observable<any> {
        
        let params = new HttpParams();
        
        if(filtro.unidade)
            params = params.set("idsUnidade", JSON.stringify(filtro.unidade.map(u => u.id)))
        
        
        if(filtro.plano) 
            params = params.set("idsPlanos", JSON.stringify(filtro.plano.map(p => p.id)))
        
        if(filtro.fonte)
            params = params.set("idFonte", filtro.fonte.id)

        if(filtro.gnd)
            params = params.set("gnd", filtro.gnd);
        
        return this.http.get<any>(`${this.relatorioApi}/gerarRelatorio/Investimento/${filtro.anoDe}/${filtro.anoAte}`, {
            params: params, 
            responseType: 'blob' as 'json', 
            observe: 'response'
        })
        .pipe(tap(response => {

            const blob = response.body;

            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'relatorio.xls';

            if(contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);

                if(match && match.length > 1) {
                    fileName = match[1];
                }
            }

            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);

            a.href = objectUrl;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);
        }));

    }

    public gerarRelatorioConsolidado(filtro : Partial<IDadoConsolidadoFiltro>) : Observable<any> {
        
        let params = new HttpParams();
        
        if(filtro.unidade)
            params = params.set("idsUnidade", JSON.stringify(filtro.unidade.map(u => u.id)))
                
        if(filtro.fonte)
            params = params.set("idFonte", filtro.fonte.id)

        if(filtro.gnd)
            params = params.set("gnd", filtro.gnd);
        
        return this.http.get<any>(`${this.relatorioApi}/gerarRelatorioConsolidado/Investimento/${filtro.anoDe}/${filtro.anoAte}`, {
            params: params, 
            responseType: 'blob' as 'json', 
            observe: 'response'
        })
        .pipe(tap(response => {

            const blob = response.body;

            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'relatorio.xls';

            if(contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);

                if(match && match.length > 1) {
                    fileName = match[1];
                }
            }

            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);

            a.href = objectUrl;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);
        }));

    }


}