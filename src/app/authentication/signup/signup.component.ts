import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, MatCardModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  Loading: boolean = false;

  constructor(public authService: AuthService, private router: Router) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.Loading = true;
    this.authService.CreateUser(form.value.email, form.value.password).subscribe({
      next: () => {
        this.Loading = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.Loading = false;
      }
    });
  }
}
