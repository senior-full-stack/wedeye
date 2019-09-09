﻿import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '@app/admin/login/login.component';
import { AuthGuard } from './helpers';

const routes: Routes = [
  {
    path: 'admin/login', component: LoginComponent
  },
  {
    path: 'admin/dashboard',
    loadChildren: './admin/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/admin/dashboard/user'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
