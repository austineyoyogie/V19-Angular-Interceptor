import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {CustomHttpResponse, Profile} from '../interface/appstates';
import {User} from '../interface/users';
import {KeyType} from '../enum/key-type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BASE_URL: string = "http://localhost:8080";
  //private readonly server: string = 'http://localhost:8080';
  private http = inject(HttpClient);

  login$ = (email: string, password: string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.post<CustomHttpResponse<Profile>>
    (`${this.BASE_URL}/api/v1/login`, { email, password })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  save$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
    this.http.post<CustomHttpResponse<Profile>>
    (`${this.BASE_URL}/api/v1/register`, user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  public getUsers$ = () => <Observable<User[]>>
    this.http.get<User[]>(`${this.BASE_URL}/api/v1/profile`)
       .pipe(
           tap(console.log),
           catchError(this.handleError)
        );

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
    (`${this.BASE_URL}/api/v1/profile`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  refreshToken(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/v1/refresh`, { headers: {
        Authorization: `Bearer ${localStorage.getItem(KeyType.REFRESH_TOKEN)}` } })
      .pipe(
        tap((response: any) => {
          console.log(response)
          localStorage.removeItem(KeyType.TOKEN);
          localStorage.removeItem(KeyType.REFRESH_TOKEN);
          localStorage.setItem(KeyType.TOKEN, response.data.access_token);
          localStorage.setItem(KeyType.REFRESH_TOKEN, response.data.refresh_token);
          localStorage.setItem(KeyType.TOKEN, response.data.access_token)
        }),
        catchError(err => {
          this.logOut();
          return throwError(() => err);
        })
      )
  }

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
    (`${this.BASE_URL}/api/v1/refresh/token`, { headers: { Authorization: `Bearer ${localStorage.getItem(KeyType.REFRESH_TOKEN)}` } })
      .pipe(
        tap(response => {
          console.log(response);
          localStorage.removeItem(KeyType.TOKEN);
          localStorage.removeItem(KeyType.REFRESH_TOKEN);
          localStorage.setItem(KeyType.TOKEN, response.data.access_token);
          localStorage.setItem(KeyType.REFRESH_TOKEN, response.data.refresh_token);
        }),
        //catchError(this.handleError)
        catchError(err => {
          this.logOut()
          return throwError(() => err);
        })
      );

  isAuthenticated(): boolean {
    const token = localStorage.getItem(KeyType.TOKEN);
    return token != null && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    return (decodedToken.exp * 1000) < Date.now();
  }

  logOut(): void {
    localStorage.removeItem(KeyType.TOKEN);
    localStorage.removeItem(KeyType.REFRESH_TOKEN);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
