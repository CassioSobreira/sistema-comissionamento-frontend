import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoCreate } from './documento-create';

describe('DocumentoCreate', () => {
  let component: DocumentoCreate;
  let fixture: ComponentFixture<DocumentoCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentoCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentoCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
