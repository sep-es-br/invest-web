import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AudienciaPublicaService } from "../../../../utils/services/audiencia-publica.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { tap, finalize, merge, Observable, switchMap } from "rxjs";
import { InfosService } from "../../../../utils/services/infos.service";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { StatusService } from "../../../../utils/services/status.service";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowRight, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { AreaTematicaService } from "../../../../utils/services/areaTematica.service";
import { IAreaTematica } from "../../../../utils/interfaces/IAreaTematica";
import { cleanApoc } from "../../../../utils/funcoes-util";
import { ProgressModalComponent } from "../../../../utils/components/progress-modal/progress-modal.component";
import { IProposta } from "../../../../utils/interfaces/proposta.interface";
import { CampoPesquisaComponent } from "../../../../utils/components/campo-pesquisa/campo-pesquisa.component";
import { Router } from "@angular/router";
import { PROPOSTA_ATIVA } from "../../../../utils/sessionLocalItems.const";

@Component({
    templateUrl: './audiencia-publica-listagem.component.html',
    styleUrl: './audiencia-publica-listagem.component.scss',
    imports: [CommonModule, NgSelectModule, FormsModule, FontAwesomeModule, ProgressModalComponent, CampoPesquisaComponent]
})
export class AudienciaPublicaListagemComponent implements OnInit{


    removerIcon = faXmarkCircle;
    criarIcon = faArrowRight;
    unidades : UnidadeOrcamentariaDTO[];
    areasTematicas : IAreaTematica[];
    podeVerUnidades : boolean = undefined;
    filtro : {
        unidades?: UnidadeOrcamentariaDTO[];
        areaTematica?: IAreaTematica,
        filtroTexto?: string
    } = {
        filtroTexto: ''
    };

    qtPropostas = 0;
    listaPropostas : IProposta[] = [];

    carregando = false;

    
    constructor(
        private apSrv : AudienciaPublicaService,
        private unidadeService: UnidadeOrcamentariaService,
        private areaTematicaSrv: AreaTematicaService,
        private permissaoService : PermissaoService,
        private router: Router
    ){}
    

    ngOnInit(): void {
        
        this.carregando = true;
        this.permissaoService.getPermissao('carteiraaudiencias').pipe(
        switchMap(permissao => {
            this.podeVerUnidades = permissao.verTodasUnidades;

            let consulta: Observable<any>[] = [
                this.areaTematicaSrv.findAllAreaTematica().pipe(
                    tap(value => this.areasTematicas = value)
                )
            ];

            const unidade$ = this.podeVerUnidades
            ? this.unidadeService.getFromSigefes().pipe(
                tap(unidadeList => this.unidades = unidadeList)
                )
            : this.unidadeService.getUnidadeDoUsuario().pipe(
                tap(unidades => {
                    this.unidades = unidades;
                    if (unidades?.length === 1) {
                    this.filtro.unidades = unidades;
                    }
                })
                );

            consulta.push(unidade$);

            return merge(...consulta);
        }),
        finalize(() => this.update())
        ).subscribe();
    }

    update(txtSearch?:string) {
        this.carregando = true;
        if(this.podeVerUnidades == undefined) return;
        
        this.apSrv.getListagem(
            this.filtro.unidades, 
            this.filtro.areaTematica, 
            txtSearch ?? this.filtro.filtroTexto, 
            this.podeVerUnidades
        ).pipe(
            tap(value => {
                this.listaPropostas = value.data;
                this.qtPropostas = value.ammount;
            }),
            finalize(() => this.carregando = false)
        ).subscribe();
    }

    removerSelecao(arr : any[], item: any) : any[] {
        arr = arr.filter(a => a !== item)
        return arr;
    }

    searchUnidade(term : string, item : UnidadeOrcamentariaDTO) {
        return cleanApoc(item.sigla).includes(cleanApoc(term))
                || item.codigo.includes(term);
    }

    searchArea(term : string, item : IAreaTematica) {
        return cleanApoc(item.nome).includes(cleanApoc(term));
    }

    criarObjeto(proposta : IProposta) {
        sessionStorage.setItem(PROPOSTA_ATIVA, JSON.stringify(proposta));
        this.router.navigateByUrl('/home/carteira/objetos/novo');
    }

}