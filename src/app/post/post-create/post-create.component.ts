import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
  imports: [FormsModule]
})
export class PostCreateComponent {

  NewPost = '';
  PostInput = '';

  onAddPost() {
    this.NewPost = this.PostInput;
  }
}

