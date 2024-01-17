import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  DoCheck,
  AfterViewInit,
  SimpleChanges,
  Input,
  ViewChild,
} from '@angular/core';
import { RatingComponent } from '../utilities/rating/rating.component';

@Component({
  selector: 'app-lifecycletst',
  templateUrl: './lifecycletst.component.html',
  styleUrls: ['./lifecycletst.component.sass'],
})
export class LifecycletstComponent
  implements OnInit, OnChanges, OnDestroy, DoCheck, AfterViewInit
{
  @Input()
  title: string;

  @ViewChild(RatingComponent)
  rating: RatingComponent;
  timer: ReturnType<typeof setInterval>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('on changes');
    console.log('changes', changes);
  }

  ngOnDestroy(): void {
    console.log('on destroy');
    clearInterval(this.timer);
  }

  ngDoCheck(): void {
    console.log('on docheck');
  }

  ngAfterViewInit(): void {
    console.log('after view init');
    console.log('rating component', this.rating);
  }

  ngOnInit(): void {
    console.log('on init');
    this.timer = setInterval(() => console.log(new Date()), 1000);
  }
}
