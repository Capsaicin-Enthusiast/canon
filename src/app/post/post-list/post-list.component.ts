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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule, MatExpansionModule, RouterModule, MatProgressSpinnerModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatIcon],
})
export class PostListComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  public userId: string | undefined;
  totalposts = 0;
  postperpage = 2;
  currentpage = 1;
  pageSizeOption = [1, 2, 5, 10];
  loading = false;
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();
  private authStatusSub!: Subscription;
  filterTitle = '';

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.postsService.getPosts(this.postperpage, this.currentpage, this.filterTitle);
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.loading = false;
        this.posts = postData.posts;
        this.totalposts = postData.postCount;
      });
    this.postsService.getPosts(this.postperpage, 1, this.filterTitle);

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.loading = true;
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentpage, this.filterTitle);
  }

  onSearch() {
    this.currentpage = 1;
    this.postsService.getPosts(this.postperpage, this.currentpage, this.filterTitle);
  }

  onDelete(postId: string) {
    this.loading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postperpage, this.currentpage, this.filterTitle);
      });
  }
}
