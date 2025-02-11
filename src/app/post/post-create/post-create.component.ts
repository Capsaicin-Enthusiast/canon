import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class PostCreateComponent {
  @Output() postCreated = new EventEmitter<{ title: string, content: string }>();
  PostTitle = '';
  PostContent = '';

  onAddPost() {
    const post = {
      title: this.PostTitle,
      content: this.PostContent
    };
    this.postCreated.emit(post);
    this.PostTitle = '';
    this.PostContent = '';
  }
}

