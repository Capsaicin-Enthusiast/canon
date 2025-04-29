import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'it_elec_6a';

  constructor(private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
