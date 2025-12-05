// src/app/guards/desktop.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LayoutService } from '../services/layout';
import { MessageService } from 'primeng/api'; 

export const desktopGuard: CanActivateFn = (route, state) => {
  const layoutService = inject(LayoutService);
  const router = inject(Router);

  if (layoutService.isMobile()) {
    // Se for mobile, bloqueia e manda para home
    console.warn('Acesso negado: Esta rota é exclusiva para Desktop.');
    router.navigate(['/home']); 
    return false;
  }

  return true;
};