import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../classes/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  showCreationForm = false;
  newUser: Partial<User> = { Name: '', Email: '' };
  private usersSub: Subscription = new Subscription();
  private addUserSub: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.usersSub = this.http
      .get<User[]>('http://localhost:3000/users')
      .subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = data;
        },
        error: (err) => {
          console.error('Error fetching users', err);
        },
      });
  }

  search(): void {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleCreationForm(): void {
    this.showCreationForm = !this.showCreationForm;
  }

  addUser(): void {
    const maxId = this.users.reduce((max, user) => Math.max(max, user.ID), 0);
    const newUserId = maxId + 1;

    const userToAdd: Omit<User, '_id'> = {
      ID: newUserId,
      Name: this.newUser.Name!,
      Email: this.newUser.Email!,
      Street: '',
      Zipcode: 0,
      City: '',
      Tasks: [],
      Posts: [],
    };

    this.addUserSub = this.http
      .post<User>('http://localhost:3000/users', userToAdd)
      .subscribe({
        next: (data) => {
          this.users.push(data);
          this.filteredUsers = this.users;
          this.newUser = { Name: '', Email: '' };
          this.showCreationForm = false;
        },
        error: (err) => {
          console.error('Error adding user', err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
    if (this.addUserSub) {
      this.addUserSub.unsubscribe();
    }
  }
}
