import { Injectable, OnInit } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService implements OnInit {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) {}

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
            id: post._id,
            imagePath: post.image
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
    return this.http
    .get<{_id: string, title: string, content: string, image: string}>('http://localhost:3000/api/posts/' + id);
  }
  // addPost(post: Post) {
  //   this.http
  //     .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
  //     .subscribe(res => {
  //       const id = res.postId;
  //       post.id = id;
  //       this.posts.push(post);
  //       console.log(res.message);
  //       this.postsUpdated.next([...this.posts]);
  //     });
  // }
  addPosts(post) {
    console.log(post);
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.imagePath, post.title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(responseData => {
        const apost: Post = {
          id: responseData.post.id,
          title: post.title,
          content: post.content,
          imagePath: responseData.post.imagePath
        };
        console.log(responseData.message);
        this.posts.push(apost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatPost(post: Post) {
    let postData;
    if ( typeof(post.imagePath) === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.imagePath, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      };
    }
    this.http.put<{ message: string, post: Post}>(`http://localhost:3000/api/posts/${post.id}`, postData)
    .subscribe(res => {
      console.log(res.message);
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      const apost: Post = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: res.post.imagePath
      };
      updatedPosts[oldPostIndex] = apost;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['']);
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
