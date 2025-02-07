import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InfosService } from "../../../../../../utils/services/infos.service";
import { UnidadeOrcamentariaService } from "../../../../../../utils/services/unidadeOrcamentaria.service";
import { UnidadeOrcamentariaDTO } from "../../../../../../utils/models/UnidadeOrcamentariaDTO";
import { merge, tap } from "rxjs";
import { StatusService } from "../../../../../../utils/services/status.service";
import { IStatus } from "../../../../../../utils/interfaces/status.interface";
import { IEtapa } from "../../../../../../utils/interfaces/etapa.interface";
import { EtapaService } from "../../../../../../utils/services/etapa.service";
import { ISelectOpcao } from "../../../../../../utils/interfaces/selectOption.interface";
import { NgSelectModule } from "@ng-select/ng-select";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'spo-objeto-filtro',
    templateUrl: './objetos-filtro.component.html',
    styleUrl: './objetos-filtro.component.scss',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule
    ]
})
export class ObjetoFiltroComponent implements AfterViewInit {
    
    filtro : IFiltro = {
        status: undefined,
        unidade: undefined,
        etapa: undefined,
        ano: new Date().getFullYear()
    }

    seta = faAngleDown

    @Output() onUpdate = new EventEmitter<IFiltro>()

    anos : number[];
    unidades : UnidadeOrcamentariaDTO[];
    status : IStatus[];
    etapas : IEtapa[];

    opcoesUnidade : ISelectOpcao<UnidadeOrcamentariaDTO>[];


    constructor(
        private infoService : InfosService,
        private unidadeService : UnidadeOrcamentariaService,
        private statusService : StatusService,
        private etapaService : EtapaService
    ){

    }

    ngAfterViewInit(): void {
        
        merge(
            this.infoService.getAllAnos().pipe(
                tap(anosList => this.setAnos(anosList))
            ),
            this.unidadeService.getAllUnidadesOrcamentarias().pipe(
                tap(unidadeList => this.setUnidades(unidadeList))
            ),
            this.statusService.findAll().pipe(
                tap(statusList => this.setStatus(statusList))
            )
        ).subscribe();

        this.etapaService.getDoUsuario().pipe(
            tap(etapa => {
                // if(etapa) {
                //     this.etapas = [etapa];
                //     this.filtro.etapa = etapa;
                //     this.atualizar();
                // } else {
                    this.etapaService.findAll().pipe(
                        tap(etapasList => this.setEtapas(etapasList))
                    ).subscribe()
                // }

            })
        ).subscribe()

    }

    atualizar(){
        this.onUpdate.emit(this.filtro);
    }

    setEtapas(etapasList : IEtapa[]){
        this.etapas = etapasList;
    }

    setAnos(anosList : number[]) {
        this.anos = anosList;    
    }

    setUnidades(unidadeList : UnidadeOrcamentariaDTO[]) {
        this.unidades = unidadeList;

        this.opcoesUnidade = unidadeList.map(unidade => {
            return {
                label: `${unidade.codigo} - ${unidade.sigla}`,
                value: unidade
            }
        })
    }

    setStatus(statusList : IStatus[]) {
        this.status = statusList;
    }

    selecionarUnidade(option : ISelectOpcao<UnidadeOrcamentariaDTO>, model : UnidadeOrcamentariaDTO) : boolean {
        return option.value?.codigo === model?.codigo
    }

    
    filtrar(term : string, item : ISelectOpcao<any>) : boolean {
        return item.label.toUpperCase().includes(term.toUpperCase());
    }
}

export interface IFiltro {
    status?: IStatus,
    unidade?: UnidadeOrcamentariaDTO,
    ano?: number,
    etapa?: IEtapa,
    nome? : string
}