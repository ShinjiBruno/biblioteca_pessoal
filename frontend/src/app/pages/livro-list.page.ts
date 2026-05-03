import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LivroService } from '../livro.service';
import { Livro } from '../livro.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, CardModule, MessageModule, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './livro-list.page.html',
  styleUrl: './livro-list.page.scss',
})
export class LivroListPage implements OnInit {
  livros: Livro[] = [];
  loading = signal(false);
  error: string | null = null;

  constructor(
    private livroService: LivroService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadLivros();
  }

  loadLivros(): void {
    this.loading.set(true);
    this.error = null;

    this.livroService.getLivros().subscribe({
      next: (livros) => {
        this.livros = livros;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar livros:', err);
        this.error = 'Não foi possível carregar os livros. Verifique a conexão com a API.';
        this.loading.set(false);
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

    this.loading.set(true);
    this.livroService.deleteLivro(id).subscribe({
      next: () => this.loadLivros(),
      error: () => {
        this.error = 'Erro ao excluir livro. Tente novamente.';
        this.loading.set(false);
      },
    });
  }
}
