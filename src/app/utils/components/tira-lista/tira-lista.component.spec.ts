import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiraListaComponent } from './tira-lista.component';

describe('TiraListaComponent', () => {
  let component: TiraListaComponent;
  let fixture: ComponentFixture<TiraListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiraListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiraListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
