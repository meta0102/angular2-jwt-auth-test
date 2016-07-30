import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { AuthService } from '../shared/index';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) { }

  login(event: any): void {
    event.preventDefault();
    this.authService.login()
      .subscribe(
      data => {
        if (data) {
          this.router.navigate(['']);
        } else {
          console.log(data);
        }
      },
      error => {
        alert(error.text());
        console.log(error.text());
      });
  }
}
