import { Component, OnInit } from '@angular/core';
import { ActorsService } from '../actors.service';
import { ActorDTO, ActorCreationDTO } from '../actor.model';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-index-actors',
  templateUrl: './index-actors.component.html',
  styleUrls: ['./index-actors.component.sass'],
})
export class IndexActorsComponent implements OnInit {
  constructor(private actorsService: ActorsService) {}

  actors: ActorDTO[];
  columnsToDisplay = ['name', 'actions'];
  totalAmountOfRecords: number;
  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadAllActors();
  }

  loadAllActors() {
    this.actorsService
      .getAll(this.currentPage, this.pageSize)
      .subscribe((response: HttpResponse<ActorDTO[]>) => {
        this.actors = response.body ?? [];
        const totalAmountOfRecordsFromHeader = response.headers.get(
          'totalAmountOfRecords'
        );
        if (
          totalAmountOfRecordsFromHeader &&
          !isNaN(Number(totalAmountOfRecordsFromHeader))
        ) {
          this.totalAmountOfRecords = Number(totalAmountOfRecordsFromHeader);
        }
      });
  }

  deleteActor(id: number) {
    this.actorsService.deleteById(id).subscribe(() => {
      this.loadAllActors();
    });
  }

  updatePagination(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAllActors();
  }
}
