import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { User } from '../classes/user';
import { Post } from '../classes/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  @Input() user?: User;
  showAddPostForm = false;
  newPostTitle = '';
  newPostBody = '';
  private addPostSubscription?: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (!this.user) {
      console.warn('User object is undefined. Please check the input.');
    }
  }

  toggleAddPostForm() {
    this.showAddPostForm = !this.showAddPostForm;
    this.newPostTitle = '';
    this.newPostBody = '';
  }

  addPost() {
    if (this.user && this.newPostTitle.trim() && this.newPostBody.trim()) {
      const newPost: Post = {
        ID:
          this.user.Posts.length > 0
            ? Math.max(...this.user.Posts.map((post) => post.ID)) + 1
            : 1,
        Title: this.newPostTitle,
        Body: this.newPostBody,
      };

      this.addPostSubscription = this.http
        .post<Post>(
          `http://localhost:3000/posts/${this.user.ID}/posts`,
          newPost
        )
        .subscribe({
          next: (addedPost: Post) => {
            this.user?.Posts.push(addedPost);
            this.toggleAddPostForm();
            this.newPostTitle = '';
            this.newPostBody = '';
          },
          error: (error) => console.error('Error adding post:', error),
        });
    }
  }

  ngOnDestroy() {
    if (this.addPostSubscription) {
      this.addPostSubscription.unsubscribe();
    }
  }
}
