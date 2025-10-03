import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Você precisará desta biblioteca para ler o token

// Interface para definir a estrutura do payload do seu token
interface UserTokenPayload {
  id: number;
  nome: string;
  perfil: string;
}

// Função auxiliar para pegar e decodificar o token
function getDecodedToken(): UserTokenPayload | null {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      return jwtDecode<UserTokenPayload>(token);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }
  return null;
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const decodedToken = getDecodedToken();

  // --- 1. Verificação de Autenticação (Se está logado) ---
  if (!decodedToken) {
    // Se não há token ou ele é inválido, redireciona para o login
    router.navigate(['/']); // Navega para a sua rota de login
    return false;
  }

  // --- 2. Verificação de Autorização (Se tem permissão) ---
  // Pega a lista de perfis permitidos da propriedade 'data' da rota
  const perfisPermitidos = route.data['perfisPermitidos'] as Array<string>;

  // Se a rota não define perfis permitidos, qualquer usuário logado pode acessar
  if (!perfisPermitidos || perfisPermitidos.length === 0) {
    return true;
  }
  
  // Compara o perfil do usuário (do token) com a lista de perfis permitidos
  const perfilDoUsuario = decodedToken.perfil;
  const temPermissao = perfisPermitidos.includes(perfilDoUsuario);

  if (temPermissao) {
    return true; // Acesso permitido!
  } else {
    // Se não tem permissão, redireciona para uma página de "acesso negado" ou para a home
    console.warn(`Acesso negado para o perfil "${perfilDoUsuario}" na rota ${state.url}`);
    router.navigate(['/']); // Crie esta página se desejar
    return false; // Bloqueia o acesso
  }
};