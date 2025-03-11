import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule, MatExpansionModule]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub!: Subscription;

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
