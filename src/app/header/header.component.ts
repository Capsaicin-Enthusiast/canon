import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule, MatIconModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs!: Subscription;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuthenticated = isAuth;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.userIsAuthenticated = this.authService.getIsAuth();
    });

    if (isPlatformBrowser(this.platformId)) {
      const theme = localStorage.getItem('theme');
      this.isDarkMode = theme === 'dark';
      this.updateBodyClass();
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      this.updateBodyClass();
    }
  }

  private updateBodyClass(): void {
    if (this.isDarkMode) {
      this.document.body.classList.add('dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode');
    }
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
