import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs';
import {AuthService} from '../service/auth.service';
import {Router,} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule,} from '@angular/forms';
import {User} from '../interface/users';
import {HttpErrorResponse} from '@angular/common/http';

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf,
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit, OnDestroy {
  public users: User[] = [] ;  // all users
  public user: User; // by id
  public refreshing: boolean;
  public selectedUser: User;  // by id
  private subscriptions: Subscription[] = [];

  private authService        = inject(AuthService);
  private router             = inject(Router);
  private toaster            = inject(ToastrService);


  ngOnInit(): void {
    this.getProfileUsers(true)
  }

  public getProfileUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.authService.getUsers$().subscribe({
        next: (response) => {
          console.log("response = ", response);
          this.users = response;
          this.refreshing = false;
          if ( showNotification ) {
            this.toaster.error('Successfully loaded')
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.toaster.error("Error loaded profiled.", errorResponse.error.message)
          this.refreshing = false;
        }
      })
    );
  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {

    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

