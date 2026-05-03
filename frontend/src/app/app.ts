import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme is initialized in ThemeService constructor
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
