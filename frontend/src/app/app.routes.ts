import { Routes } from '@angular/router';
import { LivroFormPage } from './pages/livro-form.page';
import { LivroListPage } from './pages/livro-list.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'livros' },
  {
    path: 'livros',
    component: LivroListPage,
  },
  {
    path: 'livros/novo',
    component: LivroFormPage,
  },
  {
    path: 'livros/:id/editar',
    component: LivroFormPage,
  },
  { path: '**', redirectTo: 'livros' },
];
