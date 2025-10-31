import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Modulo {
  id_modulo: number;
  nome_modulo: string;
}

export interface ModuloDetalhado extends Modulo {
  entradas_associadas: string | null; 
}

export interface Entrada {
  id_entrada: number;
  nome_entrada: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  
  private apiUrl = `${environment.apiUrl}/modulos`;
// URL para a rota específica de admin (ex: /api/admin/usuarios/:id/modulos)
  private adminApiUrl = `${environment.apiUrl}/admin`; 
  
  // (Pode ser necessário adicionar apiUrl para Entradas se for buscar todas as entradas aqui)
  private entradasApiUrl = `${environment.apiUrl}/entradas`;

  constructor(private http: HttpClient) { }

  getModulosDoUsuario(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }

  /**
   * [ADMIN] Busca a lista de TODOS os módulos disponíveis (ID e Nome).
   * Usado para popular MultiSelects.
   * Chama: GET /api/modulos/todos 
   */
  getTodosModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/todos`); 
  }

  /**
   * [ADMIN] Busca a lista de TODOS os módulos com suas entradas associadas.
   * Chama: GET /api/modulos/admin-list
   */
  getModulosComEntradas(): Observable<ModuloDetalhado[]> {
    return this.http.get<ModuloDetalhado[]>(`${this.apiUrl}/admin-list`);
  }
  
   /**
   * [ADMIN] Busca os IDs dos módulos associados a um usuário específico.
   * Chama: GET /api/admin/usuarios/:id_usuario/modulos 
   */
   getUsuarioModulos(id_usuario: number): Observable<{ id_modulo: number }[]> {
     return this.http.get<{ id_modulo: number }[]>(`${this.adminApiUrl}/usuarios/${id_usuario}/modulos`);
   }
  
  /**
   * [ADMIN] Cria um novo módulo e associa entradas.
   * Chama: POST /api/modulos
   */
  createModuloComEntradas(moduloData: { nome_modulo: string, id_entradas?: number[] }): Observable<any> {
    return this.http.post(this.apiUrl, moduloData);
  }

  /**
   * [ADMIN] Atualiza um módulo existente e/ou suas associações de entradas.
   * Chama: PUT /api/modulos/:id_modulo
   */
  updateModuloComEntradas(id_modulo: number, moduloData: { nome_modulo?: string, id_entradas?: number[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_modulo}`, moduloData);
  }

  /**
   * [ADMIN] Exclui um módulo.
   * Chama: DELETE /api/modulos/:id_modulo
   */
  deleteModulo(id_modulo: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_modulo}`);
  }

   /**
   * [ADMIN] Busca a lista de TODAS as entradas (templates) disponíveis (ID e Nome).
   * Necessário para o formulário de Módulo.
   * Chama: GET /api/entradas/todos
   */
  getTodasEntradas(): Observable<Entrada[]> { 
    return this.http.get<Entrada[]>(`${this.entradasApiUrl}/todos`);
  }

  getModuloEntradasIds(id_modulo: number): Observable<{ id_entrada: number }[]> {
    // Retorna um array de objetos: [{id_entrada: 1}, {id_entrada: 3}, ...]
    return this.http.get<{ id_entrada: number }[]>(`${this.apiUrl}/${id_modulo}/entradas`);
  }
}



