import { Injectable, OnInit } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.MongoApiUrl + '/posts/';
@Injectable({ providedIn: 'root' })
export class PostService implements OnInit {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}
  getPosts(postsPerPage: number, currentPage: number) {
    const queryString = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL  + queryString
      )
      // the pipe map is for the _id on the db
      .pipe(
        map(postData => {
        return { posts : postData.posts.map(post => {
          return {
              title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.image,
            creator: post.creator
          };
        }), maxPosts : postData.maxPosts };
      }))
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string ) {
    // return {...this.posts.find(post => post.id === id)};
    return this.http
    .get<{_id: string, title: string, content: string, image: string, creator: string}>(BACKEND_URL + id);
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
        BACKEND_URL ,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updatPost(post: Post) {
    let postData: Post | FormData;
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
        imagePath: post.imagePath,
        creator: null
      };
    }
    this.http.put<{ message: string, post: Post}>(BACKEND_URL + `/${post.id}`, postData)
    .subscribe(res => {
      this.router.navigate(['']);
    });
  }
  deletePost(id: string) {
    return this.http
      .delete<{ message: string }>(BACKEND_URL + `/${id}`);
  }
}
