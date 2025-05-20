import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  styleUrls: ['./profile-settings.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent {
  firstName = '';
  lastName = '';
  oldPassword = '';
  newPassword = '';
  success = '';
  error = '';
  pwSuccess = '';
  pwError = '';

  constructor(private authService: AuthService) { }

  onUpdateProfile(form: NgForm) {
    if (form.invalid) return;
    this.authService.updateProfile(this.firstName, this.lastName)
      .subscribe({
        next: res => { this.success = res.message; this.error = ''; },
        error: err => { this.error = err.error?.message || 'Update failed'; this.success = ''; }
      });
  }

  onChangePassword(form: NgForm) {
    if (form.invalid) return;
    this.authService.updatePassword(this.oldPassword, this.newPassword)
      .subscribe({
        next: res => { this.pwSuccess = res.message; this.pwError = ''; },
        error: err => { this.pwError = err.error?.message || 'Password update failed'; this.pwSuccess = ''; }
      });
  }
}
