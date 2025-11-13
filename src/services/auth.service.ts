import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface UserTokenPayload {
  id: number;
  nome: string;
  perfil: string;
  cargo: string;
  sexo: string;
  modulo: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<UserTokenPayload | null>(this.getDecodedToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  // BehaviorSubject para guardar e emitir o estado de autenticação
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable(); // Componentes podem "ouvir" isso

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        const user = this.getDecodedToken();
        this.currentUserSubject.next(user);
      })
    );
  }

  // Salva o token e atualiza o estado de login
  handleLoginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true); // Emite 'true' para os 'ouvintes'
  }

  // Método de Logout
  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
    this.loggedIn.next(false); // Emite 'false' para os 'ouvintes'
    this.router.navigate(['/']);
  }

  // Pega os dados do usuário a partir do token salvo
  getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode<UserTokenPayload>(token);
      } catch (error) {
        // Se o token for inválido, limpa
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;  
  }

  public getPerfilUsuario(): string | null {
    return this.currentUserSubject.value?.perfil ?? null;
  }

  /**
   * Envia o e-mail do usuário para o endpoint de "esqueci a senha".
   * @param email - O e-mail do usuário que esqueceu a senha.
   */
  esqueciSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/esqueci-senha`, { email });
  }
  /**
   * Envia o e-mail do usuário para o endpoint de "esqueci a senha".
   * @param token - O token de redefinição de senha.
   * @param novaSenha - A nova senha que o usuário deseja definir.
   */
  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/redefinir-senha`, { token, novaSenha });
  }
   /**
   * Envia a nova senha para o endpoint protegido de redefinição para usuários logados.
   * @param novaSenha - A nova senha escolhida pelo usuário.
   */
  redefinirSenhaLogado(novaSenha: string): Observable<any> {
    // O token de login é enviado automaticamente pelo interceptor.
    // Não precisamos passá-lo como argumento.
    return this.http.post(`${this.apiUrl}/usuarios/redefinir-senha-logado`, { novaSenha });
  }
  
  getMeusDados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/dados-usuario`);
  }
}
