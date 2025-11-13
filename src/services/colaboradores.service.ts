import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface Colaborador {
  id_colaborador: number;
  nome: string;
  cargo: string;
  sexo: string;
  email: string;
  modulo: string;
}

@Injectable({
    providedIn: 'root'
})
export class ColaboradorService {

    constructor(private http: HttpClient) { }
    private colaboradoresApiUrl = `${environment.apiUrl}/colaboradores`;

    /**
     * READ: Busca todos os colaboradores.
     */
    getColaboradores(): Observable<Colaborador[]> {
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        return this.http.get<Colaborador[]>(this.colaboradoresApiUrl, { headers});
    }

    /**
     * CREATE: Cria um novo colaborador.
     * (O 'body' pode ser 'any' ou uma interface 'Partial<Colaborador>')
     */
    createColaborador(body: any): Observable<Colaborador> {
      return this.http.post<Colaborador>(this.colaboradoresApiUrl, body);
    }

    /**
     * UPDATE: Atualiza um colaborador existente.
     */
    updateColaborador(id: number, body: any): Observable<Colaborador> {
      const url = `${this.colaboradoresApiUrl}/${id}`;
      return this.http.put<Colaborador>(url, body);
    }

    /**
     * DELETE: Apaga um colaborador.
     */
    deleteColaborador(id: number): Observable<any> {
      const url = `${this.colaboradoresApiUrl}/${id}`;
      return this.http.delete(url);
    }

    /**
     * IMPORTAR: Envia um arquivo para o endpoint de importação.
     */
    importColaboradores(file: File): Observable<any> {
        const data = new FormData();
        data.append('file', file);
        return this.http.post(`${this.colaboradoresApiUrl}/importar`, data);
    }
}
