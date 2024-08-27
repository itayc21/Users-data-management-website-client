import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { TodosComponent } from './todos/todos.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  declarations: [AppComponent, UsersComponent, UserComponent, TodosComponent, PostsComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
