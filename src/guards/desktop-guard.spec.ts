import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { desktopGuard } from './desktop-guard';
//--
describe('desktopGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => desktopGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
