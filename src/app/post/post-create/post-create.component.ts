import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../posts.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PostCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  Pickedimage: string | null = null;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private router: Router) { }

  private mode = 'create';
  private postId: string | null = null;
  public post: Post | null = null;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.loading = true;
        this.postsService.getPost(this.postId!).subscribe(postData => {
          this.loading = false;
          this.post = { id: postData.id, title: postData.title, content: postData.content };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: null
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  };

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === "create") {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId!,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
    this.router.navigate(['/']);
  };

  PickedImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.Pickedimage = reader.result as string;
    };
    reader.readAsDataURL(file!);
  }
}

@NgModule({
  imports: [MatProgressSpinnerModule],
})
export class PostCreateModule { }

