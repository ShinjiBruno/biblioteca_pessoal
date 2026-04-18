import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../environments/environment';
import { Livro } from './livro.model';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly baseUrl = `${api_url}/livros`;

  constructor(private http: HttpClient) {}

  getLivros(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.baseUrl);
  }

  createLivro(formData: FormData): Observable<Livro> {
    return this.http.post<Livro>(this.baseUrl, formData);
  }

  updateLivro(id: number, formData: FormData): Observable<Livro> {
    return this.http.put<Livro>(`${this.baseUrl}/${id}`, formData);
  }

  deleteLivro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
