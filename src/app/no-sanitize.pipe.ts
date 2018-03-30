import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({ name: 'noSanitize' })
export class NoSanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(content) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(content);
  }
}
