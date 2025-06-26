import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {AsyncPipe, NgIf, NgSwitch} from '@angular/common';
import {catchError, map, Observable, of, Subscription} from 'rxjs';
import {LoginState} from '../interface/appstates';
import {DataState} from '../enum/data-state';
import {Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {KeyType} from '../enum/key-type';
import {User} from '../interface/users';

import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    NgSwitch,
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  readonly DataState = DataState;
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
  }

  login(f: NgForm): void {
    this.loginState$ = this.authService.login$(f.value.email, f.value.password)
      .pipe(map(response => {
          localStorage.setItem(KeyType.TOKEN, response.data?.access_token);
          localStorage.setItem(KeyType.REFRESH_TOKEN, response.data?.refresh_token);
          this.router.navigate(['/profile']);
          return { dataState: DataState.LOADED, loginSuccess: true };
      }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, loginSuccess: false, error })
      })
    )
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
