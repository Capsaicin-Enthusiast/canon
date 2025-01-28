import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule]
})
export class PostCreateComponent {
  NewPost = '';
  PostInput = '';

  onAddPost() {
    this.NewPost = this.PostInput;
  }
}

