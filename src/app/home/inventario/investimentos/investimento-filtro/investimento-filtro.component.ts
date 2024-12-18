import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
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

@Component({
    selector: 'spo-investimento-filtro',
    templateUrl: './investimento-filtro.component.html',
    styleUrl: './investimento-filtro.component.scss',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DropdownFiltroComponent, ShortStringPipe]
})
export class InvestimentoFiltroComponent implements AfterViewInit{

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

         this.permissaoService.podeVerUnidades().pipe(tap(
                    podeVer => {
        
                        this.podeVerUnidades = podeVer;
        
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
                
                        if(this.podeVerUnidades) {
                            consulta.push(this.unidadeService.getAllUnidadesOrcamentarias()
                            .pipe(tap((unidadeList) => {

                                this.unidades = unidadeList;
                                
                            })))
                        } else {
                            consulta.push(this.unidadeService.getUnidadeDoUsuario()
                            .pipe(tap((unidade) => {
                                
                                this.filtro.unidade = unidade;
                                
                            })));
                        }
                
                        merge(
                            
                            ...consulta
                            
                        ).pipe(finalize(() => this.update())).subscribe()
                    }
                )).subscribe();

    }

    update() {

        this.filterChange.emit(this.filtro);
    }

    

}