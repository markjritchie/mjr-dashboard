import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Location {
  city: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  private apiRoot = 'https://api.openweathermap.org/data/2.5/'
  private initialQuery = '?appid=3f0bedb111e1607e4787c5725cbd7cf8&units=metric'
  // private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=3f0bedb111e1607e4787c5725cbd7cf8&units=metric';
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getForcast(location: Location) {
    return this.http.get<any>(`${this.apiRoot}forecast/${this.initialQuery}&q=${location.city},${location.country}`)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getCurrent(location: Location) {
    return this.http.get<any>(`${this.apiRoot}weather/${this.initialQuery}&q=${location.city},${location.country}`)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

}
