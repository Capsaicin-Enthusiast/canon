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
  private postUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath || null
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts])
      });
  }

  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
      "http://localhost:3000/api/posts/" + id
    ).pipe(map(postData => {
      return {
        id: postData._id,
        title: postData.title,
        content: postData.content,
        imagePath: postData.imagePath
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
        const post: Post = { id: responseData.postId, title: title, content: content, imagePath: '' };
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
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
        imagePath: image
      };
    }
    return this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .pipe(map(() => {
        const updatedPost: Post = { id: id, title: title, content: content, imagePath: typeof image === 'string' ? image : '' };
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = updatedPost;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      }));
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('Deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }
}
