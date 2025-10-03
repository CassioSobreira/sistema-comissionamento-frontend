import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaForms } from './entrada-forms';

describe('EntradaForms', () => {
  let component: EntradaForms;
  let fixture: ComponentFixture<EntradaForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
