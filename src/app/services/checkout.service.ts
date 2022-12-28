import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor() {}

  // populate months from checkbox
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // - start at current month and loop until last month in year
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    // return months as an Observable
    return of(data);
  }

  // populate years from checkbox
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Year" dropdown list
    // - start at current year and loop for next 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    // return years as an Observable
    return of(data);
  }
}
