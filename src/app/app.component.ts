import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [PostCreateComponent, PostListComponent, HeaderComponent],
  standalone: true,
})
export class AppComponent {
  title = 'it_elec_6a';
}
