import { Component, OnInit } from '@angular/core';
import { TheaterCreationDTO } from '../theater.model';
import { TheatersService } from '../theaters.service';
import { parseWebApiErrors } from 'src/app/utilities/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-theater',
  templateUrl: './create-theater.component.html',
  styleUrls: ['./create-theater.component.sass'],
})
export class CreateTheaterComponent implements OnInit {
  constructor(
    private router: Router,
    private theatersService: TheatersService
  ) {}

  errors: string[] = [];

  ngOnInit(): void {}

  saveTheater(theater: TheaterCreationDTO) {
    this.theatersService.create(theater).subscribe(
      () => {
        this.router.navigate(['/theaters']);
      },
      (error) => (this.errors = parseWebApiErrors(error))
    );
  }
}
