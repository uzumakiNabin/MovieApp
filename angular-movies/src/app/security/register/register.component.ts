import { Component, OnInit } from '@angular/core';
import { UserCredentials } from '../security.model';
import { SecurityService } from '../security.service';
import { parseWebApiErrors } from 'src/app/utilities/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  errors: string[] = [];

  register(user: UserCredentials) {
    this.errors = [];
    this.securityService.register(user).subscribe(
      (data) => {
        this.securityService.saveToken(data);
        this.router.navigate(['/']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
