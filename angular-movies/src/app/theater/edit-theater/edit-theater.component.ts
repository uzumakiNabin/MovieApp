import { Component, OnInit } from '@angular/core';
import { TheaterCreationDTO, TheaterDTO } from '../theater.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TheatersService } from '../theaters.service';
import { parseWebApiErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-edit-theater',
  templateUrl: './edit-theater.component.html',
  styleUrls: ['./edit-theater.component.sass'],
})
export class EditTheaterComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private theatersService: TheatersService,
    private router: Router
  ) {}

  model: TheaterDTO;
  errors: string[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) =>
      this.theatersService
        .getById(param['id'])
        .subscribe((theater) => (this.model = theater))
    );
  }

  editTheater(theater: TheaterCreationDTO) {
    this.theatersService.edit(this.model.id, theater).subscribe(
      () => {
        this.router.navigate(['/theaters']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
