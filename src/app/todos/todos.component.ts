import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { User } from '../classes/user';
import { Task } from '../classes/task';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit, OnDestroy {
  @Input() user?: User;
  @Input() mark: boolean = false;

  private taskCompSub: Subscription = new Subscription();
  private addTaskSub: Subscription = new Subscription();

  showAddTaskForm: boolean = false;
  newTaskTitle: string = '';

  constructor(private http: HttpClient) {}

  toggleAddTaskForm() {
    this.showAddTaskForm = !this.showAddTaskForm;
    this.newTaskTitle = '';
  }

  markCompleted(taskId: number) {
    if (this.user) {
      const task = this.user.Tasks.find((task) => task.ID === taskId);
      if (task) {
        task.Completed = true;

        console.log('Updating task:', taskId, 'with data:', {
          Completed: true,
        });

        this.taskCompSub = this.http
          .patch(
            `http://localhost:3000/tasks/${this.user.ID}/tasks/${taskId}`,
            {
              Completed: true,
            }
          )
          .subscribe({
            next: () => {
              console.log('Task completed and updated on the server');
            },
            error: (error) => {
              console.error('Error updating task status on the server:', error);
              task.Completed = false;
            },
          });
      } else {
        console.warn('Task not found.');
      }
    }
  }

  addTask() {
    if (this.user && this.newTaskTitle.trim()) {
      const lastId =
        this.user.Tasks.length > 0
          ? Math.max(...this.user.Tasks.map((task) => task.ID))
          : 0;
      const newId = lastId + 1;

      const newTask = new Task(newId, this.newTaskTitle, false);

      this.addTaskSub = this.http
        .post(`http://localhost:3000/tasks/${this.user.ID}/tasks`, newTask)
        .subscribe({
          next: (taskFromServer) => {
            console.log('New task added to server:', taskFromServer);

            this.user?.Tasks.push(taskFromServer as Task);

            this.toggleAddTaskForm();
          },
          error: (error) => {
            console.error('Error adding task to server:', error);
          },
        });
    }
  }

  ngOnInit() {
    if (!this.user) {
      console.warn('User object is undefined. Please check the input.');
    }
  }

  ngOnDestroy() {
    if (this.taskCompSub) {
      this.taskCompSub.unsubscribe();
    }
    if (this.addTaskSub) {
      this.addTaskSub.unsubscribe();
    }
  }
}
