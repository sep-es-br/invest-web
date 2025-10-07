import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { EtapaService } from '../services/etapa.service';
import { filter, firstValueFrom, of, switchMap } from 'rxjs';
import { ObjetosService } from '../services/objetos.service';

export const objetosNoFluxoResolver: ResolveFn<number> = async (route, state) => {
  
  const etapaSrv = inject(EtapaService);
  const objetoSrv = inject(ObjetosService);

  return await firstValueFrom(etapaSrv.getDoUsuario().pipe(
          switchMap(
            etapa => !etapa ? of(0) :
              objetoSrv.getQuantidadeItensEmProcessamento({etapa: etapa, exercicio: new Date().getFullYear()}))
        ));
};
