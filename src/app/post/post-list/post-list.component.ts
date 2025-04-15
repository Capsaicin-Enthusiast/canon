import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule, MatExpansionModule, RouterModule, MatProgressSpinnerModule, MatPaginatorModule]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  loading = false;
  private postsSub: Subscription = new Subscription();

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {
    this.loading = true;
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.loading = false;
        this.posts = posts;
      });
    this.postsService.getPosts();
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
