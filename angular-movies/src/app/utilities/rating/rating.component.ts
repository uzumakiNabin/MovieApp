import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { SecurityService } from 'src/app/security/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.sass'],
})
export class RatingComponent implements OnInit {
  constructor(private securityService: SecurityService) {}

  @Input()
  maxRating = 5;
  @Input()
  selectedRating = 0;
  previousRating = 0;
  maxRatingArr: number[] = [];
  @Output()
  onRating: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {
    this.maxRatingArr = Array(this.maxRating).fill(0);
  }

  handleMouseEnter(index: number) {
    this.selectedRating = index + 1;
  }

  handleMouseLeave() {
    if (this.previousRating !== 0) {
      this.selectedRating = this.previousRating;
    } else {
      this.selectedRating = 0;
    }
  }

  handleMouseClick(index: number) {
    if (this.securityService.isAuthenticated()) {
      this.selectedRating = index + 1;
      this.previousRating = this.selectedRating;
      this.onRating.emit(this.selectedRating);
    } else {
      Swal.fire(
        'Not Logged in',
        'You need to log in first to cast vote',
        'warning'
      );
    }
  }
}
