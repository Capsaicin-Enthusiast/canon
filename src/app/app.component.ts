import { Component } from '@angular/core';
import { PostCreateComponent } from './post/post-create/post-create.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [PostCreateComponent]
})
export class AppComponent {
  title = 'test';
}