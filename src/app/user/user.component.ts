import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { User } from '../classes/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() user?: User;
  showOtherData = false;
  showTodos = false;
  showPosts = false;
  showUpdateForm = false;

  private deleteUserSub?: Subscription = new Subscription();
  private updateUserSub?: Subscription = new Subscription();

  constructor(public http: HttpClient) {}

  confirmDelete(): void {
    const confirmation = window.confirm(
      'Are you sure you want to delete this user?'
    );
    if (confirmation) {
      this.deleteUser();
    }
  }

  deleteUser(): void {
    const ID = this.user?.ID;
    if (ID !== undefined) {
      this.deleteUserSub = this.http
        .delete(`http://localhost:3000/users/${ID}`)
        .subscribe({
          next: (response) => {
            console.log('User deleted successfully:', response);
            window.location.reload();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          },
        });
    } else {
      console.error('User ID is undefined. Cannot delete user.');
    }
  }

  updateUser(): void {
    if (this.user) {
      const ID = this.user._id;
      this.updateUserSub = this.http
        .put(`http://localhost:3000/users/${ID}`, this.user)
        .subscribe({
          next: (response) => {
            console.log('User updated successfully:', response);
            this.showUpdateForm = false;
            window.location.reload();
          },
          error: (error) => {
            console.error('Error updating user:', error);
          },
        });
    } else {
      console.error('User data is undefined. Cannot update user.');
    }
  }

  toggleUpdateForm(): void {
    this.showUpdateForm = !this.showUpdateForm;
  }

  toggleOtherData() {
    this.showOtherData = !this.showOtherData;
  }

  toggleTodos() {
    this.showTodos = !this.showTodos;
  }

  togglePosts() {
    this.showPosts = !this.showPosts;
  }

  ngOnInit() {
    if (!this.user) {
      console.warn('User object is undefined. Please check the input.');
    }
  }

  ngOnDestroy(): void {
    this.deleteUserSub?.unsubscribe();
    this.updateUserSub?.unsubscribe();
  }
}
