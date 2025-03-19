import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IFiltroInvestimento } from "../../home/relatorio/detalhado/investimento-filtro/IFiltroInvestimento";
import { Observable, tap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({providedIn: "root"})
export class RelatorioService {

    private readonly relatorioApi = `${environment.apiUrl}/relatorio`;

    constructor(
        private http : HttpClient
    ){}

    public gerarRelatorio(filtro : Partial<IFiltroInvestimento>) : Observable<any> {
        
        let params = new HttpParams()
                        .set("anoDe", filtro.anoDe)
                        .set("anoAte", filtro.anoAte);
        
        return this.http.get<any>(`${this.relatorioApi}/gerarRelatorio`, {
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