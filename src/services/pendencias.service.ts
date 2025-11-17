import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Pendencia {
  idDocumento: number;
  numeroProtocolo: string | null;
  nome: string;
  modulo: string;
  status: 'Aguardando aprovação' | 'Aprovado';
  nomeDocumento: string;
}

@Injectable({
  providedIn: 'root'
})
export class PendenciasService {

  private workflowApiUrl = `${environment.apiUrl}/workflow`;

  constructor(private http: HttpClient) {}

  getPendencias(id_usuario: number): Observable<Pendencia[]> {
    return this.http.get<Pendencia[]>(`${this.workflowApiUrl}/pendencias/${id_usuario}`);
  }

  aprovarDocumento(id_documento: number): Observable<any> {
    return this.http.put(`${this.workflowApiUrl}/aprovar/${id_documento}`, {});
  }

  rejeitarDocumento(id_documento: number): Observable<any> {
    return this.http.put(`${this.workflowApiUrl}/rejeitar/${id_documento}`, {});
  }
}
