import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InfosService } from "../../../../utils/services/infos.service";
import { PlanoOrcamentarioService } from "../../../../utils/services/planoOrcamentario.service";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";
import { UnidadeOrcamentariaService } from "../../../../utils/services/unidadeOrcamentaria.service";
import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { FonteOrcamentariaService } from "../../../../utils/services/fonteOrcamentaria.service";
import { finalize, merge, Observable, tap } from "rxjs";
import { DropdownFiltroComponent } from "../../../../utils/components/dropdown-filtro/dropdown-filtro.component";
import { IFiltroInvestimento } from "./IFiltroInvestimento";
import { PermissaoService } from "../../../../utils/services/permissao.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { DatePickerModule } from 'primeng/datepicker';
import { TipoDespesaEnum } from "../../../../utils/enum/tipoDespesa.enum";

@Component({
    selector: 'spo-investimento-filtro',
    templateUrl: './investimento-filtro.component.html',
    styleUrl: './investimento-filtro.component.scss',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, NgSelectModule,
        FormsModule, FontAwesomeModule, DatePickerModule
    ]
})
export class InvestimentoFiltroComponent implements AfterViewInit{

    removerIcon = faXmarkCircle;

    @Output() public filterChange = new EventEmitter<Partial<IFiltroInvestimento>>();

    @ViewChild("dropdownAno", {read: DropdownFiltroComponent}) dropdownAnoComponent : DropdownFiltroComponent;
    
    anosMin : number[];
    anosMax : number[];
    planos : PlanoOrcamentarioDTO[];
    unidades : UnidadeOrcamentariaDTO[];
    fontes : FonteOrcamentariaDTO[];

    filtro : Partial<IFiltroInvestimento> = {};

    maxDate : Date;
    minDate : Date;
    
    podeVerUnidades = false;

    TipoDespesa = TipoDespesaEnum;

    constructor(private infosService: InfosService,
                private planoService: PlanoOrcamentarioService,
                private unidadeService: UnidadeOrcamentariaService,
                private fonteService : FonteOrcamentariaService,
                private permissaoService : PermissaoService
    ) {}

    dataRange : Date[];

    ngAfterViewInit(): void {
               

        let consulta : Observable<any>[] = [
            this.infosService.getAllAnos()
                .pipe(tap((anosList) => {
                    this.maxDate = new Date(anosList[anosList.length-1], 0, 1);
                    this.minDate = new Date(anosList[0], 0, 1);

                    let hoje = new Date();

                    let anoPassado : Date = new Date(hoje);
                    let anoQVem : Date = new Date(hoje);

                    anoPassado.setFullYear(hoje.getFullYear() - 1);
                    anoQVem.setFullYear(hoje.getFullYear() + 1);

                    this.dataRange = [anoPassado, anoQVem];
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
                if(this.podeVerUnidades) {
                    consulta.push(this.unidadeService.getAllUnidadesOrcamentarias()
                    .pipe(tap((unidadeList) => {
        
                        this.unidades = unidadeList;
                        
                    })))
                } else {
                    consulta.push(this.unidadeService.getUnidadeDoUsuario()
                    .pipe(tap((unidades) => {
                        
                        this.unidades = unidades;
                        if(unidades?.length == 1) {
                            this.filtro.unidade = unidades;
                        }

                        
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
        this.filtro.podeVerUnidades = this.podeVerUnidades;
        if(this.dataRange[0] && this.dataRange[1]){
            this.filtro.anoDe = this.dataRange[0].getFullYear();
            this.filtro.anoAte = this.dataRange[1].getFullYear();
        }
        this.filterChange.emit(this.filtro);
    }

    

}