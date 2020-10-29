import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'previewContent'})
export class PreviewContentPipe implements PipeTransform {
  transform(value: string, maxlength: number): string {
    if (value !== undefined) {
      maxlength = maxlength ? maxlength : 80;
      return value.substr(0, maxlength);
    }
  }
}