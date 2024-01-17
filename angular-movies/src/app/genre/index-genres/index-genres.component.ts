import { Component, OnInit } from '@angular/core';
import { GenresService } from '../genres.service';
import { GenreDTO } from '../genre.model';

@Component({
  selector: 'app-index-genres',
  templateUrl: './index-genres.component.html',
  styleUrls: ['./index-genres.component.sass'],
})
export class IndexGenresComponent implements OnInit {
  constructor(private genreService: GenresService) {}

  genres: GenreDTO[];
  columnsToDisplay = ['name', 'actions'];

  ngOnInit(): void {
    this.loadAllGenres();
  }

  loadAllGenres() {
    this.genreService.getAll().subscribe((genres) => {
      this.genres = genres ?? [];
    });
  }

  deleteGenre(id: number) {
    this.genreService.deleteById(id).subscribe(() => {
      this.loadAllGenres();
    });
  }
}
