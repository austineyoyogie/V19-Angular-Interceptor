import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './authentication/login/login.component';
import {RegisterComponent} from './authentication/register/register.component';
import {ProfileComponent} from './authentication/profile/profile.component';
import {AdminComponent} from './admin/admin.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', title: "Auth", component: LoginComponent },
  { path: 'register', title: "Create", component: RegisterComponent },
  { path: 'profile', title: "Profile", component: ProfileComponent },
  { path: 'admin', title: "Admin Panel", component: AdminComponent },
  { path: '404',title: "NotFound",  component: NotFoundComponent },
  { path: '**', redirectTo: '/404'}
];
