import { Injectable, OnInit } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService implements OnInit {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}

  ngOnInit() {}
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      // the pipe map is for the _id on the db
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
              title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPost => {
        this.posts = transformedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string ) {
    // return {...this.posts.find(post => post.id === id)};
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }
  addPosts(post: Post) {
    this.http
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe(res => {
        const id = res.postId;
        post.id = id;
        this.posts.push(post);
        console.log(res.message);
        this.postsUpdated.next([...this.posts]);
      });
  }
  updatPost(post: Post) {
    this.http.put<{ message: string}>(`http://localhost:3000/api/posts/${post.id}`, post)
    .subscribe(res => {
      console.log(res.message);
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
  deletePost(id: string) {
    this.http
      .delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`)
      .subscribe(res => {
        console.log(res.message);
        const updatedPosts = this.posts.filter( post =>  post.id !== id );
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
