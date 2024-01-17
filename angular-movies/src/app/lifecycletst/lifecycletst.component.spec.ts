import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifecycletstComponent } from './lifecycletst.component';

describe('LifecycletstComponent', () => {
  let component: LifecycletstComponent;
  let fixture: ComponentFixture<LifecycletstComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LifecycletstComponent]
    });
    fixture = TestBed.createComponent(LifecycletstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
