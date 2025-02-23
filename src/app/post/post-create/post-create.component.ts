import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class PostCreateComponent {

  constructor(public postsService: PostsService) {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title,
      form.value.content);
    form.resetForm();
  };

  /* @Output() postCreated = new EventEmitter<{ title: string, content: string }>();
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
  } */
}

