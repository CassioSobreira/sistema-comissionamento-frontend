import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Exemplo de chamada para a rota de login
  login(credentials: any): Observable<any> {
    // Faz a chamada para POST /api/usuarios/login
    return this.http.post(`${this.apiUrl}/usuarios/login`, credentials);
  }

  // Exemplo de chamada para uma rota GET protegida
  getHomeData(): Observable<any> {
    // O token JWT precisa ser adicionado nos headers.
    // Veremos como fazer isso de forma automática no próximo passo.
    return this.http.get(`${this.apiUrl}/usuarios/home`);
  }
}