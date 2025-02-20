import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import { DropdownFiltroComponent } from "../../../../../utils/components/dropdown-filtro/dropdown-filtro.component";
import { IObjetoFiltro } from "../../../../../utils/interfaces/objetoFiltro.interface";
import { UnidadeOrcamentariaDTO } from "../../../../../utils/models/UnidadeOrcamentariaDTO";
import { UnidadeOrcamentariaService } from "../../../../../utils/services/unidadeOrcamentaria.service";
import { finalize, merge, Observable, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { PlanoOrcamentarioDTO } from "../../../../../utils/models/PlanoOrcamentarioDTO";
import { InfosService } from "../../../../../utils/services/infos.service";
import { PlanoOrcamentarioService } from "../../../../../utils/services/planoOrcamentario.service";
import { PermissaoService } from "../../../../../utils/services/permissao.service";
import { ObjetosService } from "../../../../../utils/services/objetos.service";
import { IStatus } from "../../../../../utils/interfaces/status.interface";
import { StatusService } from "../../../../../utils/services/status.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "spo-objetos-filtro",
    standalone: true,
    templateUrl: "./objetos-filtro.component.html",
    styleUrl: "./objetos-filtro.component.scss",
    imports: [
        CommonModule, DropdownFiltroComponent, NgSelectModule, FormsModule,
        FontAwesomeModule
    ]
})
export class ObjetosFiltroComponent implements AfterViewInit {

    removerIcon = faXmarkCircle;

    filtro : IObjetoFiltro = {}

    @Output() public filterChange = new EventEmitter<IObjetoFiltro>();


    unidades : UnidadeOrcamentariaDTO[];
    anos : number[];
    planos : PlanoOrcamentarioDTO[];
    status : IStatus[];

    planoSemPlano : PlanoOrcamentarioDTO = {
        nome: 'Sem P.O.',
        codigo: 'S.PO',
        id: 'S.PO'
    }

    podeVerUnidades = false;

    constructor(
        private infosService: InfosService,
        private planoService: PlanoOrcamentarioService,
        private unidadeService: UnidadeOrcamentariaService,
        private permissaoService : PermissaoService,
        private statusService : StatusService
    ){}

    update() {

        this.filterChange.emit(this.filtro);
    }

    

    
    filtrarSimples(term : string, item : { nome : string}) : boolean {
        return item.nome.toUpperCase().includes(term.toUpperCase());
    }

    searchUnidade(term : string, item : UnidadeOrcamentariaDTO) {
        return item.sigla.toUpperCase().includes(term.toUpperCase())
                || item.codigo.includes(term);
    }

    searchPlano(term : string, item : PlanoOrcamentarioDTO) {
        return item.nome.toUpperCase().includes(term.toUpperCase())
                || item.codigo.includes(term);
    }

    removerSelecao(arr : any[], item: any) : any[] {
        arr = arr.filter(a => a !== item)
        return arr;
    }

    ngAfterViewInit(): void {

        let consulta : Observable<any>[] = [
            this.infosService.getAllAnos()
            .pipe(tap((anosList) => {
                this.anos = anosList;

                this.filtro.exercicio = new Date().getFullYear();

            })),
            this.planoService.getAllPlanos()
            .pipe(tap((planoList) => {
                this.planos = planoList;
            })),
            this.statusService.findAll()
            .pipe(tap(statusList => {
                this.status = statusList;
            }))
        ]


        this.permissaoService.getPermissao('carteiraobjetos').pipe(
            tap(permissao => {

                this.podeVerUnidades = permissao.verTodasUnidades;
                if(permissao.verTodasUnidades) {
                    consulta.push(this.unidadeService.getAllUnidadesOrcamentarias()
                    .pipe(tap((unidadeList) => {
                        
                        this.unidades = unidadeList;
                        
                    })));
                } else {
                    consulta.push(this.unidadeService.getUnidadeDoUsuario()
                    .pipe(tap( unidade => {
                        this.filtro.unidade = [unidade]
                        this.unidades = [unidade];
                    })))
                }

            }),
            finalize(() => {
                merge(
            
                    ...consulta
                    
                ).pipe(finalize(() => this.update())).subscribe()
            })
        ).subscribe()

        
        
                
    }

}