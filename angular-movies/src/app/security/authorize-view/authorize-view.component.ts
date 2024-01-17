import { Component, Input } from '@angular/core';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-authorize-view',
  templateUrl: './authorize-view.component.html',
  styleUrls: ['./authorize-view.component.sass'],
})
export class AuthorizeViewComponent {
  constructor(private securityService: SecurityService) {}

  @Input()
  role: string;

  public isAuthorized() {
    if (this.role) {
      return this.securityService.getRole() === this.role;
    } else {
      return this.securityService.isAuthenticated();
    }
  }
}
