// I copied this file from https://github.com/stevepapa/angular2-autosize
// because I couldn't get importing external dependencies working with all of
// this angular2-seed crap.

import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'textarea[autosize]'
})
export class TextareaAutosizeDirective {
  constructor(public element: ElementRef){
  }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement) {
    this.adjust();
  }

  ngAfterContentChecked() {
    this.adjust();
  }

  adjust() {
    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.style.height = 'auto';
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + 'px';
  }
}
