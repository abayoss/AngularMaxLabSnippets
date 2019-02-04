import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  private mode = 'create';
  private postId: string;
  isLoading = false;

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(( paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
          // the time out is just to show the spinner
          setTimeout(() => {
              this.isLoading = false;
            }, 2000);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
      console.log('mode = ' + this.mode );
    });
  }
  onSavePost(form: NgForm) {
    if ( form.invalid ) {
      return;
    }
    const post: Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    if ( this.mode === 'create') {
      this.postService.addPosts(post);
      this.router.navigate(['']);
    } else {
      post.id = this.postId;
      this.postService.updatPost(post);
      this.router.navigate(['']);
    }
    form.resetForm();
  }
}
