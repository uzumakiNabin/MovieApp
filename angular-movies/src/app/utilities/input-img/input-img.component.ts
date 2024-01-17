import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { toBase64 } from '../utils';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.sass'],
})
export class InputImgComponent implements OnInit {
  constructor() {}

  imageBase64: string;

  @Input()
  existingImage: string | undefined;

  @Output()
  onImageSelected = new EventEmitter<File>();

  ngOnInit(): void {}

  async handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];
      toBase64(file).then((value) => (this.imageBase64 = value));
      this.onImageSelected.emit(file);
    }
  }
}
