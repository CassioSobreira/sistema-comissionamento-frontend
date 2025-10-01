// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Uma função simples para verificar a existência do token
function isUserLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (isUserLoggedIn()) {
    return true; // Permite o acesso à rota
  } else {
    // Se não estiver logado, redireciona para a página de login
    router.navigate(['/']);
    return false; // Bloqueia o acesso à rota
  }
};