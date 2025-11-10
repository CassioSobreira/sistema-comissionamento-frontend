import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { environment } from '../environments/environment';
  export interface Entrada{
    id_entrada: number;
    nome_entrada: string;
    campo_json: any;
    template_html: string;
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

  /**
   * Busca os detalhes completos de uma entrada (template) específica pelo ID.
   * Esta função é a que o seu DocumentoCreateComponent usará.
   * Chama a rota: GET /api/entradas/:id
   * @param id_entrada O ID da entrada (template) a ser buscada.
   */
  buscarEntradaPorId(id_entrada: number): Observable<Entrada> {
    // Constrói a URL final, ex: /api/entradas/1
    const url = `${this.apiUrl}/${id_entrada}`;
    
    // Faz a requisição GET e espera um objeto do tipo 'Entrada'
    return this.http.get<Entrada>(url);
  }
  
  }
