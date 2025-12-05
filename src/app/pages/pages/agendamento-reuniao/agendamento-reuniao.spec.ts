import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoReuniao } from './agendamento-reuniao';

describe('AgendamentoReuniao', () => {
  let component: AgendamentoReuniao;
  let fixture: ComponentFixture<AgendamentoReuniao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoReuniao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentoReuniao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
