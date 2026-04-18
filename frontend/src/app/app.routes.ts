import { Routes } from '@angular/router';
import { LivroFormPage } from './pages/livro-form.page';
import { LivroListPage } from './pages/livro-list.page';
import { KeycloakAuthGuardService } from './keycloak-auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'livros' },
  {
    path: 'livros',
    component: LivroListPage,
    canActivate: [KeycloakAuthGuardService],
  },
  {
    path: 'livros/novo',
    component: LivroFormPage,
    canActivate: [KeycloakAuthGuardService],
  },
  {
    path: 'livros/:id/editar',
    component: LivroFormPage,
    canActivate: [KeycloakAuthGuardService],
  },
  { path: '**', redirectTo: 'livros' },
];
