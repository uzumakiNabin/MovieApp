import { Component, OnInit, Input } from '@angular/core';
import { MultipleSelectorModel } from './multiple-selector.model';

@Component({
  selector: 'app-multiple-selector',
  templateUrl: './multiple-selector.component.html',
  styleUrls: ['./multiple-selector.component.sass'],
})
export class MultipleSelectorComponent implements OnInit {
  constructor() {}

  @Input()
  selectedItems: MultipleSelectorModel[] = [];
  @Input()
  nonselectedItems: MultipleSelectorModel[] = [];

  ngOnInit(): void {}

  select(item: MultipleSelectorModel, index: number) {
    this.selectedItems.push(item);
    this.nonselectedItems.splice(index, 1);
  }

  unselect(item: MultipleSelectorModel, index: number) {
    this.nonselectedItems.push(item);
    this.selectedItems.splice(index, 1);
  }

  selectAll() {
    this.selectedItems.push(...this.nonselectedItems);
    this.nonselectedItems = [];
  }

  unselectAll() {
    this.nonselectedItems.push(...this.selectedItems);
    this.selectedItems = [];
  }
}
