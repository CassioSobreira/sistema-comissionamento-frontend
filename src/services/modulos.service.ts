import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Modulo{
  id_modulo: number;
  nome_modulo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  
  private apiUrl = `${environment.apiUrl}/modulos`;

  constructor(private http: HttpClient) { }

  getModulosDoUsuario(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }
}
