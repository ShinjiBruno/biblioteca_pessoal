import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LivroService } from '../livro.service';
import { Livro } from '../livro.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './livro-list.page.html',
  styleUrl: './livro-list.page.scss',
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
