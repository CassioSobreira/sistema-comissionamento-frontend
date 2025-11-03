import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPendenciaComponent } from './card-pendencia-component';

describe('CardPendenciaComponent', () => {
  let component: CardPendenciaComponent;
  let fixture: ComponentFixture<CardPendenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPendenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPendenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
