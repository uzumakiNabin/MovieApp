import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-input-markdown',
  templateUrl: './input-markdown.component.html',
  styleUrls: ['./input-markdown.component.sass'],
})
export class InputMarkdownComponent implements OnInit {
  constructor() {}

  markdownContent: string;

  @Input()
  existingContent: string | undefined;

  @Input()
  label: string = 'Text';

  @Output()
  onTextChange = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.existingContent) {
      this.markdownContent = this.existingContent;
    }
  }

  handleTextChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.onTextChange.emit(target?.value);
  }
}
