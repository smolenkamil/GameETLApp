import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = '/load';
const extractUrl = '/scrap'
const transformUrl = '/transform'
const loadUrl = '/dbload'
const consoleUrl = '/console'
const exportUrl = '/export'
const deleteUrl = '/delete'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  deleteAllData(): Observable<any> {
    return this.http.get(deleteUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }


  export(command: string): Observable<any> {
    const url = `${exportUrl}/${command}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  extract(): Observable<any> {
    return this.http.get(extractUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  transform(): Observable<any> {
    return this.http.get(transformUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  load(command: string): Observable<any> {
    const url = `${loadUrl}/${command}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGames(): Observable<any> {
    return this.http.get(apiUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGame(id: string): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getConsoleMessages(): Observable<any> {
    return this.http.get(consoleUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }


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
    return throwError('Something bad happened; please try again later.');
  }


}


