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

    getColaboradores(): Observable<Colaborador[]> {
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        return this.http.get<Colaborador[]>(this.colaboradoresApiUrl, { headers});
    }

    importColaboradores(file: File): Observable<any> {
        const data = new FormData();
        data.append('file', file);
        return this.http.post(`${this.colaboradoresApiUrl}/importar`, data);
    }
}


