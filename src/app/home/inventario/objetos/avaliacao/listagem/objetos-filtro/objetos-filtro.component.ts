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

@Component({
    selector: 'spo-objeto-filtro',
    templateUrl: './objetos-filtro.component.html',
    styleUrl: './objetos-filtro.component.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ObjetoFiltroComponent implements AfterViewInit {
    
    filtro : IFiltro = {
        status: undefined,
        unidade: undefined,
        etapa: undefined,
        ano: new Date().getFullYear()
    }

    @Output() onUpdate = new EventEmitter<IFiltro>()

    anos : number[];
    unidades : UnidadeOrcamentariaDTO[];
    status : IStatus[];
    etapas : IEtapa[];


    constructor(
        private infoService : InfosService,
        private unidadeService : UnidadeOrcamentariaService,
        private statusService : StatusService,
        private etapaService : EtapaService
    ){

    }

    ngAfterViewInit(): void {
        merge(
            this.etapaService.findAll().pipe(
                tap(etapasList => this.setEtapas(etapasList))
            ),
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
    }

    setStatus(statusList : IStatus[]) {
        this.status = statusList;
    }
}

export interface IFiltro {
    status: IStatus,
    unidade: UnidadeOrcamentariaDTO,
    ano: number,
    etapa: IEtapa,
    nome? : string
}