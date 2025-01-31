import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule]
})
export class HeaderComponent { }
