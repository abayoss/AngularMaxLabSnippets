import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  isLoading = false;
  postsPerPage = 2;
  totalPosts = 5;
  currentPage = 1;
  postPagesArr = [2, 5, 10, 20];
  constructor(private postService: PostService) {}

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
  }
}
