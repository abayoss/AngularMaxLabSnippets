import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './7.1 mime-type.validator.ts';


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
  form: FormGroup;
  imagePreview;

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl (null,
        { validators: [ Validators.required, Validators.minLength(3) ]}),
      content: new FormControl(null,
        { validators: [ Validators.required ]}),
        image: new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        })
    });
    this.route.paramMap.subscribe(( paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.image
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
          // the time out is just to show the spinner
          // setTimeout(() => {
              this.isLoading = false;
          //   }, 1000);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
      console.log('mode = ' + this.mode );
    });
  }

  onImagePicked(event: Event) {
    // get the file from the event change
    const file = (event.target as HTMLInputElement).files[0];
    // unlike setValue, patchValue updates only on Control
    this.form.patchValue({ image: file });
    // Recalculates the value and validation status of the control.
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if ( this.form.invalid ) {
      return;
    }
    const post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: this.form.value.image
    };
    if ( this.mode === 'create') {
      console.log(this.form.value.image);
      this.postService.addPosts(post);
    } else {
      post.id = this.postId;
      this.postService.updatPost(post);
    }
    this.form.reset();
  }
}
