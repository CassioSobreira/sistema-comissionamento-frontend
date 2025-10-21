import { TestBed } from '@angular/core/testing';

import { EntradasService, Entrada } from './entradas.service';

describe('Entradas', () => {
  let service: EntradasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
