import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  carregando = signal<boolean>(false);

  constructor() { }
}
