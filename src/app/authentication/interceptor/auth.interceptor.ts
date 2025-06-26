import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {KeyType} from '../enum/key-type';
import {Router} from '@angular/router';
import {catchError, switchMap, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if( req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh')) {
    return next(req);
  }
  if(authService.isAuthenticated()) {
    const token = localStorage.getItem(KeyType.TOKEN);
    req = addToken(req, token!!);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401) {
        return handle401Error(req, next);
      }
      return throwError(() => error);
    })
  )
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.refreshToken$().pipe(
    switchMap((response) => {
      console.log('Token Refresh Response:', response);
      localStorage.setItem(KeyType.TOKEN, response.data.access_token);
      return next(addToken(req, response.data.access_token));

    }),
    catchError(err => {
      authService.logOut()
      router.navigate(['login']);
      return throwError(() => err);
    })
  );
}

function addToken(req: HttpRequest<unknown>, token: string) : HttpRequest<any>{
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    }
  });
}
