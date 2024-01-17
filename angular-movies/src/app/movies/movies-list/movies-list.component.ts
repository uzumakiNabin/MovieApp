import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MovieDTO } from '../movie.model';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.sass'],
})
export class MoviesListComponent {
  constructor(private moviesService: MoviesService) {}

  @Input() movies: MovieDTO[] | undefined;
  @Input() title: String = 'Movies';

  @Output()
  onDelete = new EventEmitter<void>();

  removeMovie(id: number): void {
    this.moviesService.deleteById(id).subscribe(() => {
      this.onDelete.emit();
    });
  }
}
