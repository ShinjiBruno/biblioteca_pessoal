import { Routes } from '@angular/router';
import { LivroFormPage } from './pages/livro-form.page';
import { LivroListPage } from './pages/livro-list.page';
import { canActivateAuthRole } from './keycloak-auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'livros' },
  {
    path: 'livros',
    component: LivroListPage,
    canActivate: [canActivateAuthRole],
  },
  {
    path: 'livros/novo',
    component: LivroFormPage,
    canActivate: [canActivateAuthRole],
  },
  {
    path: 'livros/:id/editar',
    component: LivroFormPage,
    canActivate: [canActivateAuthRole],
  },
  { path: '**', redirectTo: 'livros' },
];
