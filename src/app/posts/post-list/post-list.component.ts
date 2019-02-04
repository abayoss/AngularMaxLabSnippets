import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  isLoading = false;
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSubscription =  this.postService.getPostUpdateListener()
        // we call the next function on the observable :
        .subscribe((posts: Post[]) => {
          this.posts = posts;
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
        });
  }
  onDeletePost(id) {
    this.postService.deletePost(id);
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
