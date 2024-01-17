import { Component, OnInit } from '@angular/core';
import { TheatersService } from '../theaters.service';
import { TheaterDTO } from '../theater.model';

@Component({
  selector: 'app-index-theaters',
  templateUrl: './index-theaters.component.html',
  styleUrls: ['./index-theaters.component.sass'],
})
export class IndexTheatersComponent implements OnInit {
  constructor(private theatersService: TheatersService) {}

  theaters: TheaterDTO[];
  columnsToDisplay = ['name', 'actions'];
  ngOnInit(): void {
    this.loadAllTheaters();
  }

  loadAllTheaters() {
    this.theatersService.getAll().subscribe((theaters) => {
      this.theaters = theaters ?? [];
    });
  }

  deleteTheater(id: number) {
    this.theatersService.deleteById(id).subscribe(() => {
      this.loadAllTheaters();
    });
  }
}
