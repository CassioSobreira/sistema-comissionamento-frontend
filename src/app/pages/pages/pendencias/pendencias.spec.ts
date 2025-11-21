import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendenciasPageComponent } from './pendencias';

describe('Pendencias', () => {
  let component: PendenciasPageComponent;
  let fixture: ComponentFixture<PendenciasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendenciasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendenciasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
