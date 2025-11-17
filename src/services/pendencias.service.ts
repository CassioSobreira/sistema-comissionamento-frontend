import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Pendencia } from '../models/card-pendencia.interface';

@Injectable({
  providedIn: 'root'
})
export class PendenciasService {

  private workflowApiUrl = `${environment.apiUrl}/workflow`;

  constructor(private http: HttpClient) {}

  getPendencias(id_usuario: number): Observable<Pendencia[]> {
    return this.http.get<Pendencia[]>(`${this.workflowApiUrl}/pendencias/${id_usuario}`);
  }

  aprovarDocumento(idDocumento: number, idUsuario: number): Observable<any> {
  return this.http.post(`${this.workflowApiUrl}/aprovar`, {
    idDocumento,
    idUsuario
  });
}

  rejeitarDocumento(idDocumento: number, idUsuario: number): Observable<any> {
  return this.http.post(`${this.workflowApiUrl}/rejeitar`, {
    idDocumento,
    idUsuario
  });
}
}
