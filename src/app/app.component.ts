import { Component } from '@angular/core';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from './post/post-list/post-list/post-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [PostCreateComponent, HeaderComponent, PostListComponent]
})
export class AppComponent {
  title = 'test';
  storedPosts: { title: string, content: string }[] = [];

  onPostAdded(post: { title: string, content: string }) {
    this.storedPosts = [...this.storedPosts, post];
  }
}