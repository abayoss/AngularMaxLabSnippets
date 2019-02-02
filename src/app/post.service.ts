import { Injectable, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService implements OnInit {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}

  ngOnInit() {}
  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  addPosts(post) {
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post).subscribe(res => {
      console.log(res.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
