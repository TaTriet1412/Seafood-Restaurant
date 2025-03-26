import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class NumberFormatService {
  constructor() {}

  formatNumber(value: number): string {
    if (typeof value !== 'number') {
      console.error('Invalid input. The provided value must be a number.');
      return '';
    }

    // Use the JavaScript `Intl.NumberFormat` API for formatting
    return new Intl.NumberFormat('vi-VN').format(value);
  }
}   