import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LivroService } from '../livro.service';
import { Livro } from '../livro.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './livro-form.page.html',
  styleUrl: './livro-form.page.scss',
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
