import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  postsPerPage = 2;
  totalPosts = 5;
  currentPage = 1;
  postPagesArr = [2, 5, 10, 20];
  private postSubscription: Subscription;
  private authStatusSub: Subscription;
  authStatus = false;
  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage );
    this.postSubscription =  this.postService.getPostUpdateListener()
        // we call the next function on the observable :
        .subscribe((postData: {posts: Post[], postCount: number }) => {
          this.posts = postData.posts;
          this.totalPosts = postData.postCount;
          // setTimeout(() => {
            this.isLoading = false;
          // }, 2000);
        });
    this.authStatus = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListnner()
    .subscribe(isAuthenticated => {
      this.authStatus = isAuthenticated;
    });
  }
  onDeletePost(id) {
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage );
    });
  }
  pageChanged(page: PageEvent) {
    this.currentPage = page.pageIndex + 1;
    this.postsPerPage = page.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
