import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pendencias } from './pendencias';

describe('Pendencias', () => {
  let component: Pendencias;
  let fixture: ComponentFixture<Pendencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pendencias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pendencias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
