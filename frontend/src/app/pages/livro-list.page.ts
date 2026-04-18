import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LivroService } from '../livro.service';
import { Livro } from '../livro.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page-header">
      <div>
        <h1>Biblioteca Pessoal</h1>
        <p>Gerencie seus livros e arquivos PDF através do gateway Krakend.</p>
      </div>
      <a routerLink="/livros/novo" class="btn primary">Adicionar livro</a>
    </section>

    <div *ngIf="loading" class="message">Carregando livros...</div>
    <div *ngIf="error" class="message error">{{ error }}</div>

    <table *ngIf="!loading && livros.length" class="livro-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>PDF</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let livro of livros">
          <td>{{ livro.titulo }}</td>
          <td>{{ livro.autor }}</td>
          <td>
            <a *ngIf="livro.pdf_url" [href]="livro.pdf_url" target="_blank" rel="noopener">Ver arquivo</a>
            <span *ngIf="!livro.pdf_url">Nenhum arquivo</span>
          </td>
          <td class="actions-cell">
            <button type="button" class="btn secondary" (click)="editar(livro.id)">Editar</button>
            <button type="button" class="btn danger" (click)="remover(livro.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="!loading && !livros.length" class="message">Nenhum livro cadastrado ainda.</div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }

      .livro-table {
        width: 100%;
        border-collapse: collapse;
        background: #ffffff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      }

      .livro-table th,
      .livro-table td {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }

      .livro-table th {
        background: #f8fafc;
        font-weight: 600;
      }

      .actions-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .message {
        padding: 1rem;
        border-radius: 0.5rem;
        background: #eff6ff;
        color: #1d4ed8;
      }

      .message.error {
        background: #fee2e2;
        color: #991b1b;
      }

      .btn {
        display: inline-block;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        text-decoration: none;
        color: #fff;
        font-weight: 600;
      }

      .btn.primary {
        background: #2563eb;
      }

      .btn.secondary {
        background: #475569;
      }

      .btn.danger {
        background: #dc2626;
      }
    `,
  ],
})
export class LivroListPage implements OnInit {
  livros: Livro[] = [];
  loading = false;
  error: string | null = null;

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    this.loadLivros();
  }

  loadLivros(): void {
    this.loading = true;
    this.error = null;

    this.livroService.getLivros().subscribe({
      next: (livros) => {
        this.livros = livros;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar os livros. Verifique o gateway e autenticação.';
        this.loading = false;
      },
    });
  }

  editar(id: number): void {
    this.router.navigate(['/livros', id, 'editar']);
  }

  remover(id: number): void {
    if (!confirm('Deseja excluir este livro?')) {
      return;
    }

    this.loading = true;
    this.livroService.deleteLivro(id).subscribe({
      next: () => this.loadLivros(),
      error: () => {
        this.error = 'Erro ao excluir livro. Tente novamente.';
        this.loading = false;
      },
    });
  }
}
