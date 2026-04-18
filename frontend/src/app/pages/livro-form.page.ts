import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LivroService } from '../livro.service';
import { Livro } from '../livro.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="page-header">
      <div>
        <h1>{{ editing ? 'Editar livro' : 'Novo livro' }}</h1>
        <p>Enviar título, autor e um arquivo PDF opcional para o gateway Krakend.</p>
      </div>
    </section>

    <form class="book-form" (ngSubmit)="onSubmit()">
      <label>
        Título
        <input name="titulo" type="text" [(ngModel)]="titulo" required />
      </label>

      <label>
        Autor
        <input name="autor" type="text" [(ngModel)]="autor" required />
      </label>

      <label>
        Arquivo PDF (opcional)
        <input type="file" (change)="onFileChange($event)" accept="application/pdf" />
      </label>

      <div class="actions">
        <a routerLink="/livros" class="btn secondary">Cancelar</a>
        <button type="submit" class="btn primary" [disabled]="loading">{{ editing ? 'Salvar' : 'Criar' }}</button>
      </div>

      <div *ngIf="message" class="message">{{ message }}</div>
      <div *ngIf="error" class="message error">{{ error }}</div>
    </form>
  `,
  styles: [
    `
      .book-form {
        display: grid;
        gap: 1rem;
        max-width: 600px;
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 2px 16px rgba(15, 23, 42, 0.08);
      }

      .book-form label {
        display: grid;
        gap: 0.5rem;
        font-weight: 600;
      }

      .book-form input[type='text'],
      .book-form input[type='file'] {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.75rem;
        background: #f8fafc;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .message {
        padding: 1rem;
        border-radius: 0.75rem;
        background: #e0f2fe;
        color: #0369a1;
      }

      .message.error {
        background: #fee2e2;
        color: #991b1b;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 120px;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        border: none;
        color: #ffffff;
        cursor: pointer;
        text-decoration: none;
      }

      .btn.primary {
        background: #2563eb;
      }

      .btn.secondary {
        background: #475569;
      }
    `,
  ],
})
export class LivroFormPage implements OnInit {
  editing = false;
  loading = false;
  titulo = '';
  autor = '';
  arquivo: File | null = null;
  message: string | null = null;
  error: string | null = null;
  private livroId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livroService: LivroService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.editing = true;
      this.livroId = Number(paramId);
      this.loadLivro(this.livroId);
    }
  }

  loadLivro(id: number): void {
    this.loading = true;
    this.error = null;

    this.livroService.getLivros().subscribe({
      next: (livros) => {
        const livro = livros.find((item) => item.id === id);
        if (!livro) {
          this.error = 'Livro não encontrado.';
          this.loading = false;
          return;
        }

        this.titulo = livro.titulo;
        this.autor = livro.autor;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar livro. Confira se o Krakend está ativo e sua autenticação.';
        this.loading = false;
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.arquivo = input.files?.[0] ?? null;
  }

  onSubmit(): void {
    if (!this.titulo.trim() || !this.autor.trim()) {
      this.error = 'Título e autor são obrigatórios.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.message = null;

    const formData = new FormData();
    formData.append('titulo', this.titulo.trim());
    formData.append('autor', this.autor.trim());
    if (this.arquivo) {
      formData.append('arquivo', this.arquivo, this.arquivo.name);
    }

    const request = this.editing && this.livroId
      ? this.livroService.updateLivro(this.livroId, formData)
      : this.livroService.createLivro(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/livros']);
      },
      error: () => {
        this.error = 'Falha ao salvar o livro. Verifique o Krakend, a autenticação e tente novamente.';
        this.loading = false;
      },
    });
  }
}
