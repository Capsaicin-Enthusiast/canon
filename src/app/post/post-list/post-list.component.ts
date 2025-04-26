import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../authentication/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule, MatExpansionModule, RouterModule, MatProgressSpinnerModule, MatPaginatorModule]
})
export class PostListComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  totalposts = 0;
  postperpage = 2;
  currentpage = 1;
  pageSizeOption = [1, 2, 5, 10];
  loading = false;
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();
  private authStatusSub!: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.postsService.getPosts(this.postperpage, this.currentpage);
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.loading = false;
        this.posts = postData.posts;
        this.totalposts = postData.postCount;
      });
    this.postsService.getPosts(this.postperpage, 1);

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.loading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postperpage, this.currentpage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.loading = true;
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentpage);
  }
}
