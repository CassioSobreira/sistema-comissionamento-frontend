import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  id_perfil: number;
  nome_perfil: string;
  status: 'ativo' | 'inativo' | 'pendente_ativacao';
}

export interface Entrada {
  id_entrada: number;
  nome_entrada: string;
  // Adicione outras propriedades se necessário
}

export interface Perfil {
  id_perfil: number;
  nome_perfil: string;
}

export interface Modulo {
  id_modulo: number;
  nome_modulo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = `${environment.apiUrl}/admin`;
  private entradasApiUrl = `${environment.apiUrl}/entradas`;
  private usuariosApiUrl = `${environment.apiUrl}/usuarios`; // URL para o registro
  private perfisApiUrl = `${environment.apiUrl}/perfis`; 
  private modulosApiUrl = `${environment.apiUrl}/modulos`; 


  constructor(private http: HttpClient) { }

  // =================================================================
  // MÉTODOS PARA O CRUD DE USUÁRIOS
  // =================================================================

  /**
   * NOVO: Registra um novo usuário (chamado por um admin).
   * Chama: POST /api/usuarios/registrar
   */
  registrarUsuario(usuarioData: { nome: string, email: string, id_perfil: number, id_modulos?: number[] }): Observable<any> {
    return this.http.post(`${this.usuariosApiUrl}/registrar`, usuarioData);
  }

 /**
   * Busca os IDs dos módulos associados a um usuário específico.
   * Chama: GET /api/admin/usuarios/:id_usuario/modulos
   */
  getUsuarioModulos(id_usuario: number): Observable<{ id_modulo: number }[]> {
    // Retorna um array de objetos, cada um com a propriedade id_modulo
    return this.http.get<{ id_modulo: number }[]>(`${this.adminApiUrl}/usuarios/${id_usuario}/modulos`);
  }
  
  /**
   * Busca a lista completa de usuários.
   * Chama: GET /api/admin/usuarios
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.adminApiUrl}/usuarios`);
  }

  getPerfis(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.perfisApiUrl);
  }
 /**
   * Atualiza os dados de um usuário (perfil e status).
   * Chama: PUT /api/admin/usuarios/:id_usuario
   */
  updateUsuario(id_usuario: number, dadosUsuario: { id_perfil: number, status: string, id_modulos: number[] }): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/usuarios/${id_usuario}`, dadosUsuario);
  }
  /**
   * AJUSTADO: Inativa um usuário.
   * Chama: PATCH /api/admin/usuarios/:id_usuario/inativar
   */
  inativarUsuario(id_usuario: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/usuarios/${id_usuario}/inativar`, {});
  }

  /**
   * AJUSTADO: Reativa um usuário.
   * Chama: PATCH /api/admin/usuarios/:id_usuario/reativar
   */
  reativarUsuario(id_usuario: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/usuarios/${id_usuario}/reativar`, {});
  }

  /**
   * AJUSTADO: Deleta um usuário permanentemente (nomeado como 'excluirUsuario').
   * Chama: DELETE /api/admin/usuarios/:id_usuario
   */
  excluirUsuario(id_usuario: number): Observable<any> {
    return this.http.delete(`${this.adminApiUrl}/usuarios/${id_usuario}`);
  }

  // =================================================================
  // MÉTODOS PARA O CRUD DE ENTRADAS (TEMPLATES)
  // =================================================================

  /**
   * Busca a lista completa de entradas (templates).
   * Chama: GET /api/entradas
   */
  getEntradas(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.entradasApiUrl);
  }

  /**
   * Cria uma nova entrada (template).
   * Chama: POST /api/entradas
   */
  createEntrada(entradaData: any): Observable<any> {
    return this.http.post(this.entradasApiUrl, entradaData);
  }

  /**
   * Atualiza uma entrada (template) existente.
   * Chama: PUT /api/entradas/:id
   */
  updateEntrada(id: number, entradaData: any): Observable<any> {
    return this.http.put(`${this.entradasApiUrl}/${id}`, entradaData);
  }

  /**
   * Deleta uma entrada (template).
   * Chama: DELETE /api/entradas/:id
   */
  deleteEntrada(id: number): Observable<any> {
    return this.http.delete(`${this.entradasApiUrl}/${id}`);
  }

    // =================================================================
  // MÉTODOS PARA O CRUD DE MODULOS
  // =================================================================

  /**
   * Busca a lista de TODOS os módulos disponíveis.
   * Chama: GET /api/modulos/todos (AJUSTE A ROTA SE NECESSÁRIO)
   */
  getTodosModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.modulosApiUrl}/todos`); 
  }
}