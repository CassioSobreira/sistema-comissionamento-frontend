import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  import { environment } from '../environments/environment';
  export interface Entrada{
    id_entrada: number;
    nome_entrada: string;

  }
  @Injectable({
    providedIn: 'root'
  })
  export class EntradasService {

    private apiUrl = `${environment.apiUrl}/entradas`;

    constructor(private http: HttpClient) { }

    /**
   * Busca a lista de entradas associadas a um módulo específico.
   * O token de autenticação é adicionado automaticamente pelo seu AuthInterceptor.
   * Chama a rota: GET /api/entradas/por-modulo/:id_modulo
   * @param id_modulo O ID do módulo do qual buscar as entradas.
   */
    getEntradasPorModulo(id_modulo: number): Observable<Entrada[]> {

      const url = `${this.apiUrl}/por-modulo/${id_modulo}`;
    
      return this.http.get<Entrada[]>(url);
  }

  
  }
