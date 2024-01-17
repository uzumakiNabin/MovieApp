import { Component } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { UserCredentials } from '../security.model';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  errors: string[] = [];

  login(user: UserCredentials) {
    this.securityService.login(user).subscribe(
      (response) => {
        this.securityService.saveToken(response);
        this.router.navigate(['/']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
