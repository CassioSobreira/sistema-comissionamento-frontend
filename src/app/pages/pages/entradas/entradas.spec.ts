import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entradas } from './entradas';

describe('Entradas', () => {
  let component: Entradas;
  let fixture: ComponentFixture<Entradas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entradas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entradas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
