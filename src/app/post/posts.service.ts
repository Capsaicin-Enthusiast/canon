import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(pagesize: number, currentPage: number) {
    const queryParams = `?pagesize=${pagesize}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath || null,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);
        this.posts = transformedPostsData.posts;
        this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts });
      });
  }

  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(
      "http://localhost:3000/api/posts/" + id
    ).pipe(map(postData => {
      return {
        id: postData._id,
        title: postData.title,
        content: postData.content,
        imagePath: postData.imagePath,
        creator: postData.creator
      } as Post;
    }));
  }

  addPost(title: string, content: string, image: File): Observable<any> {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    return this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', postData)
      .pipe(map((responseData) => {
        const post: Post = { id: responseData.postId, title: title, content: content, imagePath: '', creator: '' };
        this.posts.push(post);
        this.postUpdated.next({ posts: [...this.posts], postCount: this.posts.length });
      }));
  }

  updatePost(id: string, title: string, content: string, image: File | string): Observable<any> {
    let postData: Post | FormData;
    if (typeof (image) == 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: ''
      };
    }
    return this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .pipe(map(() => {
        const updatedPost: Post = { id: id, title: title, content: content, imagePath: typeof image === 'string' ? image : '', creator: '' };
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = updatedPost;
        this.posts = updatedPosts;
        this.postUpdated.next({ posts: [...this.posts], postCount: this.posts.length });
      }));
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
