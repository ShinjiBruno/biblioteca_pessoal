import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'biblioteca-theme';
  theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  private getStoredTheme(): Theme {
    if (typeof localStorage === 'undefined') {
      return 'light';
    }

    const stored = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }

    // Detecta preferência do sistema
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  private saveTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark-theme');
      html.classList.remove('light-theme');
    } else {
      html.classList.add('light-theme');
      html.classList.remove('dark-theme');
    }
  }
}
