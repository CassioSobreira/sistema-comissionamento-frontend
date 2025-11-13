import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoCriado } from './documento-criado';

describe('DocumentoCriado', () => {
  let component: DocumentoCriado;
  let fixture: ComponentFixture<DocumentoCriado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentoCriado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentoCriado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
