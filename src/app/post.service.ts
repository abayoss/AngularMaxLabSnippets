import { Injectable, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})

export class PostService implements OnInit {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor() {}

  ngOnInit() {

  }
  getPosts() {
    // we can do this but it's not clean:
    // return this.posts;

    return [...this.posts];
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  addPosts(post) {
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
