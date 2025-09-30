import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaSenha } from './confirma-senha';

describe('ConfirmaSenha', () => {
  let component: ConfirmaSenha;
  let fixture: ComponentFixture<ConfirmaSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmaSenha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmaSenha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
