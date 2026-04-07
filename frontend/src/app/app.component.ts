import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
 
@Component({
  selector: 'app-root',
  template: `
    <h1>Users</h1>
    <div *ngFor="let user of users">
      {{user.name}} - {{user.email}}
    </div>
  `
})
export class AppComponent implements OnInit {
 
  users: any[] = [];
 
  constructor(private api: ApiService) {}
 
  ngOnInit() {
    this.api.getUsers().subscribe(data => {
      this.users = data;
    });
  }
}
 