import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.isAuthenticated();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.userIsAuthenticated = this.authService.isAuthenticated();
    });
  }

  onLogout(): void {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}
