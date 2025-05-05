import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  message = "An Unknown Error Occurred!"
};
