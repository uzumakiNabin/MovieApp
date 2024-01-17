import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-errors',
  templateUrl: './display-errors.component.html',
  styleUrls: ['./display-errors.component.sass'],
})
export class DisplayErrorsComponent implements OnInit {
  constructor() {}
  @Input()
  errors: string[] = [];
  ngOnInit(): void {}
}
