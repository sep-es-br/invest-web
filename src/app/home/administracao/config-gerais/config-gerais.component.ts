import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { DatePicker } from "primeng/datepicker";
import { ConfigGeraisService } from '../../../utils/services/config-gerais.service';
import { toIsoZonedDateTime } from '../../../utils/funcoes-util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-config-gerais',
  templateUrl: './config-gerais.component.html',
  styleUrls: ['./config-gerais.component.scss'],
  imports: [
    CommonModule,
    DatePicker,
    FormsModule,
    FontAwesomeModule
  ]
})
export class ConfigGeraisComponent implements OnInit {

  periodoRevisao : Date[];

  salvarIcon = faFloppyDisk

  constructor(
    private readonly configGeraisSrv : ConfigGeraisService,
    private readonly toastr : ToastrService
  ) { }

  ngOnInit() {
    this.configGeraisSrv.buscar().subscribe({
      next: (config) => {
        if(!config) return;

        this.periodoRevisao = config.inicioRevisaoPip && config.fimRevisaoPip ? [new Date(config.inicioRevisaoPip), new Date(config.fimRevisaoPip)] : null;
      }
    })

  }

  salvar() {
    this.configGeraisSrv.salvar({
      inicioRevisaoPip: this.periodoRevisao && toIsoZonedDateTime(this.periodoRevisao[0]),
      fimRevisaoPip: this.periodoRevisao && toIsoZonedDateTime(this.periodoRevisao[1]) 
    }).subscribe(novoConfig => {

      if(!novoConfig) return;

      this.periodoRevisao = novoConfig.inicioRevisaoPip && novoConfig.fimRevisaoPip ? [new Date(novoConfig.inicioRevisaoPip), new Date(novoConfig.fimRevisaoPip)] : null;

      this.toastr.success("Configurações salvas com sucesso")
    })
  }

}
