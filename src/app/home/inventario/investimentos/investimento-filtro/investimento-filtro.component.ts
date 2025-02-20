import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InvestimentosComponent } from "../investimentos.component";
import { InfosService } from "../../../../utils/services/infos.service";
import { Router } from "@angular/router";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";
import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { FonteOrcamentariaService } from "../../../../utils/services/fonteOrcamentaria.service";
import { finalize, merge, Observable, tap } from "rxjs";
import { IDropdownFiltroItem, DropdownFiltroComponent } from "../../../../utils/components/dropdown-filtro/dropdown-filtro.component";
import { IFiltroInvestimento } from "./IFiltroInvestimento";
import { ShortStringPipe } from "../../../../utils/pipes/shortString.pipe";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'spo-investimento-filtro',
    templateUrl: './investimento-filtro.component.html',
    styleUrl: './investimento-filtro.component.scss',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, DropdownFiltroComponent, NgSelectModule,
        FormsModule, FontAwesomeModule
    ]
})
export class InvestimentoFiltroComponent implements AfterViewInit{

    removerIcon = faXmarkCircle;

    @Output() public filterChange = new EventEmitter<IFiltroInvestimento>();

    @ViewChild("dropdownAno", {read: DropdownFiltroComponent}) dropdownAnoComponent : DropdownFiltroComponent;
    
    anos : number[];
    planos : PlanoOrcamentarioDTO[];
    unidades : UnidadeOrcamentariaDTO[];
    fontes : FonteOrcamentariaDTO[];

    filtro : IFiltroInvestimento = {};

    
    podeVerUnidades = false;

    constructor(private infosService: InfosService,
                private planoService: PlanoOrcamentarioService,
                private unidadeService: UnidadeOrcamentariaService,
                private fonteService : FonteOrcamentariaService,
                private permissaoService : PermissaoService
    ) {}

    ngAfterViewInit(): void {
        // this.resetarCampos();

        //  this.permissaoService.podeVerUnidades().pipe(tap(
        //             podeVer => {
        
        //                 this.podeVerUnidades = podeVer;
        
                        
        //             }
        //         )).subscribe();

        
        

        let consulta : Observable<any>[] = [
            this.infosService.getAllAnos()
                .pipe(tap((anosList) => {
                    this.anos = anosList;

                    this.filtro.ano = new Date().getFullYear();

                })),
                this.planoService.getAllPlanos()
                .pipe(tap((planoList) => {
                    this.planos = planoList;
                })),
                this.fonteService.findAll()
                .pipe(tap((fonteList) => {
                    this.fontes = fonteList
                }))
        ]

        this.permissaoService.getPermissao("inventarioinvestimentos").pipe(
            tap(permissao => {
                this.podeVerUnidades = permissao.verTodasUnidades;
                if(permissao.verTodasUnidades) {
                    consulta.push(this.unidadeService.getAllUnidadesOrcamentarias()
                    .pipe(tap((unidadeList) => {
        
                        this.unidades = unidadeList;
                        
                    })))
                } else {
                    consulta.push(this.unidadeService.getUnidadeDoUsuario()
                    .pipe(tap((unidade) => {
                        
                        this.filtro.unidade = [unidade];
                        
                    })));
                }
            }),
            finalize(() => {
                merge(
            
                    ...consulta
                    
                ).pipe(finalize(() => this.update())).subscribe()
            })
        ).subscribe();


        

    }

    removerSelecao(arr : any[], item: any) : any[] {
        arr = arr.filter(a => a !== item)
        return arr;
    }

    searchUnidade(term : string, item : UnidadeOrcamentariaDTO) {
        return item.sigla.toUpperCase().includes(term.toUpperCase())
                || item.codigo.includes(term);
    }

    searchPlano(term : string, item : PlanoOrcamentarioDTO) {
        return item.nome.toUpperCase().includes(term.toUpperCase())
                || item.codigo.includes(term);
    }

    update() {

        this.filterChange.emit(this.filtro);
    }

    

}