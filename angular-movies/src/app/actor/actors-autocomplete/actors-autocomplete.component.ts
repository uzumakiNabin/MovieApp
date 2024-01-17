import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { ActorMovieDTO } from '../actor.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActorsService } from '../actors.service';

@Component({
  selector: 'app-actors-autocomplete',
  templateUrl: './actors-autocomplete.component.html',
  styleUrls: ['./actors-autocomplete.component.sass'],
})
export class ActorsAutocompleteComponent implements OnInit {
  constructor(private actorsService: ActorsService) {}
  control: FormControl = new FormControl();

  actorsToShow: ActorMovieDTO[] = [];

  @Input()
  selectedActors: ActorMovieDTO[] = [];
  columnsToDisplay = ['photo', 'name', 'character', 'actions'];

  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit(): void {
    this.control.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.actorsService.searchByName(value).subscribe((actors) => {
          this.actorsToShow = actors;
        });
      }
    });
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.control.patchValue('');
    if (
      this.selectedActors.findIndex(
        (actor) => actor.id === event.option.value.id
      ) !== -1
    ) {
      return;
    }
    this.selectedActors.push(event.option.value);
    if (this.table !== undefined) {
      this.table.renderRows();
    }
  }

  remove(actor: ActorMovieDTO) {
    const index = this.selectedActors.findIndex((a) => a.name === actor.name);
    this.selectedActors.splice(index, 1);
    this.table.renderRows();
  }

  dropped(event: CdkDragDrop<ActorMovieDTO[]>) {
    const previousIndex = this.selectedActors.findIndex(
      (actor) => actor === event.item.data
    );
    moveItemInArray(this.selectedActors, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
}
