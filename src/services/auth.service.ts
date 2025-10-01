import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // BehaviorSubject para guardar e emitir o estado de autenticação
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable(); // Componentes podem "ouvir" isso

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login`, credentials);
  }

  // Salva o token e atualiza o estado de login
  handleLoginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true); // Emite 'true' para os 'ouvintes'
  }

  // Método de Logout
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false); // Emite 'false' para os 'ouvintes'
    this.router.navigate(['/']);
  }

  // Pega os dados do usuário a partir do token salvo
  getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
      }
    }
    return null;
  }
}
