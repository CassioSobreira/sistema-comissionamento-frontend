import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface DocumentoPayload {
  id_entrada: number;
  dados_preenchidos: any; 
  assinantes: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private apiUrl = `${environment.apiUrl}/documentos`;

  constructor(private http: HttpClient) { }

  /**
   * Salva um novo documento preenchido.
   * Chama: POST /api/documentos
   */
  criarDocumento(payload: DocumentoPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

   /**
   * Salva um novo documento preenchido.
   * Chama: POST /api/documentos
   */
  downloadDocumento(id_documento: number): Observable<Blob> {
    const url = `${this.apiUrl}/${id_documento}/download`;
    return this.http.get(url, { responseType: 'blob' });
  }
}