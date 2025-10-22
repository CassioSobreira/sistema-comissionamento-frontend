import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloForms } from './modulo-forms';

describe('ModuloForms', () => {
  let component: ModuloForms;
  let fixture: ComponentFixture<ModuloForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
