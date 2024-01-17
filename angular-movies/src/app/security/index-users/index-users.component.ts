import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { UserDTO } from '../security.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-users',
  templateUrl: './index-users.component.html',
  styleUrls: ['./index-users.component.sass'],
})
export class IndexUsersComponent implements OnInit {
  constructor(private securityService: SecurityService) {}

  users: UserDTO[];
  page: number = 1;
  pageSize: number = 10;
  totalAmountOfRecords: number;
  columnsToDisplay = ['email', 'actions'];

  ngOnInit(): void {
    this.securityService
      .getUsers(this.page, this.pageSize)
      .subscribe((response) => {
        this.users = response.body ?? [];
        this.totalAmountOfRecords = Number(
          response.headers.get('totalAmountOfRecords')
        );
      });
  }

  makeAdmin(userId: string) {
    this.securityService.makeAdmin(userId).subscribe(() => {
      Swal.fire('Success', 'Successfully added', 'success');
    });
  }

  removeAdmin(userId: string) {
    this.securityService.removeAdmin(userId).subscribe(() => {
      Swal.fire('Success', 'Successfully removed', 'success');
    });
  }
}
