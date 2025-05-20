import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
})
export class ProfileSettingsComponent {
  pwForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirm: ['', Validators.required],
    },
    { validators: this.matchPasswords }
  );

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  matchPasswords(group: AbstractControl) {
    return group.get('newPassword')!.value === group.get('confirm')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.pwForm.invalid) return;
    const { oldPassword, newPassword } = this.pwForm.value;
    this.auth.updatePassword(oldPassword, newPassword).subscribe({
      next: () => alert('Password updated'),
      error: () => alert('Update failed'),
    });
  }
}
