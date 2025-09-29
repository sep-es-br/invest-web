import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { EtapaService } from '../services/etapa.service';
import { filter, switchMap } from 'rxjs';
import { ObjetosService } from '../services/objetos.service';

export const objetosNoFluxoResolver: ResolveFn<number> = (route, state) => {
  
  const etapaSrv = inject(EtapaService);
  const objetoSrv = inject(ObjetosService);

  return etapaSrv.getDoUsuario().pipe(
          filter(etapa => etapa != null),
          switchMap(etapa => objetoSrv.getQuantidadeItensEmProcessamento({etapa: etapa, exercicio: new Date().getFullYear()}))
        );
};
