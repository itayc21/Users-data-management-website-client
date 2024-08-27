import { Task } from "./task";
import { Post } from "./post";

export class User {
  constructor(
    public _id: string,  
    public ID: number,
    public Name: string,
    public Email: string,
    public Street: string,
    public City: string,
    public Zipcode: number,
    public Tasks: Task[],
    public Posts: Post[]
  ) {}
}
