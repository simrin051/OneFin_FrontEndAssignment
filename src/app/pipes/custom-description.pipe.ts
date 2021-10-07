import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDescription',
})
export class CustomDescriptionPipe implements PipeTransform {
  originaltext = null;
  transform(
    text: string,
    length: number = 120,
    suffix: string = '...'
  ): string {
    if (text.length > length) {
      this.originaltext = text;
      let truncated: string = text.substring(0, length).trim() + suffix;
      return truncated;
    }

    return text;
  }
}
