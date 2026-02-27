import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs/internal/Observable";
import { ObjetoFiltro } from "../models/ObjetoFiltro";
import { catchError, EMPTY, empty, EmptyError, map, of, switchMap, throwError } from "rxjs";
import { InvestimentoFiltro } from "../models/InvestimentoFiltro";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjetoTiraDTO } from "../models/ObjetoTiraDTO";
import { IObjetoFiltro } from "../interfaces/objetoFiltro.interface";
import { IObjeto } from "../interfaces/IObjeto";
import { ToastrService } from "ngx-toastr";
import { IStatus } from "../interfaces/status.interface";
import { IHttpError } from "../interfaces/http-error.interface";
import { IOrdemItem } from "../interfaces/ordem-item.interface";
import { IDataList } from "../interfaces/dataList.interface";
import { IObjetoDetail } from "../interfaces/objetoDetail.interface";
import { IObjetoCadastroForm } from "../interfaces/objeto-cadastro-form.interface";

@Injectable({providedIn: "root"})
export class ObjetosService {

    private readonly objetoUrl = `${environment.apiUrl}/objeto`;

    constructor(private http : HttpClient,
        private router : Router,
        private toastr : ToastrService,
        private route : ActivatedRoute
    ){
    }


    public getListaTiraObjetos( filtro : IObjetoFiltro, ordem : IOrdemItem[], pgAtual : number, tamPg : number ) : Observable<IDataList<ObjetoTiraDTO>> {

        let params = this.objetoFilterToParams(filtro)
                        .set("pgAtual", pgAtual)
                        .set("tamPag", tamPg);
        

        return this.http.post<IDataList<ObjetoTiraDTO>>(`${this.objetoUrl}/allTira`, 
            { 
                ...filtro,
                tamPag: tamPg,
                pagAtual: pgAtual,
                ordem: ordem
            }
        )
    }

    public getListaTiraObjetosEmProcessamento( filtro : IObjetoFiltro, pgAtual : number, tamPg : number ) : Observable<IDataList<ObjetoTiraDTO>> {

        let params = this.objetoFilterToParams(filtro)
                        .set("pgAtual", pgAtual)
                        .set("tamPag", tamPg);
        

        return this.http.get<IDataList<ObjetoTiraDTO>>(`${this.objetoUrl}/allTiraEmProcessamento`, { params: params })
    }

    public getQuantidadeItensEmProcessamento( filtro : IObjetoFiltro) : Observable<number> {
        return this.http.post<number>(`${this.objetoUrl}/countEmProcessameto`, {params: this.objetoFilterToParams(filtro)})
    }

    public salvarObjeto(objeto : IObjetoCadastroForm) : Observable<any> {
        return this.http.post(`${this.objetoUrl}`, objeto)
    }

    public getById(id : number) : Observable<unknown> {
        return this.http.get<IObjetoDetail>(`${this.objetoUrl}/byId`, { params: { id: id } })
        .pipe(catchError((err) => {
                let mensagemErro : IHttpError = err.error    

                if(mensagemErro.codigo == 404){
                    this.toastr.error(mensagemErro.mensagem)
                    this.router.navigate([".."], {relativeTo: this.route})
                    return EmptyError;
                }

                return err;
            }));
    }

    public objetoFilterToParams(filtro : IObjetoFiltro) : HttpParams {
        let params : HttpParams = new HttpParams();

        if(filtro.nome) 
            params = params.set("nome", filtro.nome)

        if(filtro.status) 
            params = params.set("statusId", filtro.status.id)

        if(filtro.unidades && filtro.unidades.length > 0)
            params = params.set("unidadeId", JSON.stringify(filtro.unidades.map(u => u.id)))

        if(filtro.planos && filtro.planos.length > 0)
            params = params.set("idPo", JSON.stringify( filtro.planos.map(p => p.id < 0 ? 'S.PO' : p.id) ))

        if(filtro.etapa)
            params = params.set("etapaId", filtro.etapa.id)

        if(filtro.gnd)
            params = params.set("gnd", filtro.gnd)

        params = params.set("podeVerUnidades", !!filtro.podeVerUnidades)


        return params.set("ano", filtro.exercicio);
    }

    public removerObjeto(objetoId : number) : Observable<IObjeto> {
        return this.http.delete<IObjeto>(`${this.objetoUrl}`, { params: {
            objetoId: objetoId
        }}).pipe(
            catchError((err : HttpErrorResponse) => {
                if(
                    err.status == HttpStatusCode.NoContent ||
                    err.status == HttpStatusCode.UnprocessableEntity
                ) {
                    this.toastr.error(err.error.mensagem)
                    return EMPTY;
                }

                throw EmptyError;
                
            })
        );
    }

}
