﻿import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserGetComponent } from './user/user-get/user-get.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { VendorGetComponent } from './vendor/vendor-get/vendor-get.component';
import { VendorAddComponent } from './vendor/vendor-add/vendor-add.component';
import { VendorEditComponent } from './vendor/vendor-edit/vendor-edit.component';
import { BlogGetComponent } from './blog/blog-get/blog-get.component';
import { ReportGetComponent } from './report/report-get/report-get.component';
import { BlogAddComponent } from './blog/blog-add/blog-add.component';
import { BlogEditComponent } from './blog/blog-edit/blog-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard/user', pathMatch: 'full' },
  { path: '', component: DashboardComponent ,
    children: [
      { path: 'user', component: UserGetComponent },
      { path: 'user/edit', component: UserEditComponent },
      { path: 'vendor', component: VendorGetComponent },
      { path: 'vendor/add', component: VendorAddComponent },
      { path: 'vendor/edit', component: VendorEditComponent },
      { path: 'blog', component: BlogGetComponent },
      { path: 'blog/add', component: BlogAddComponent },
      { path: 'blog/edit', component: BlogEditComponent },
      { path: 'report', component: ReportGetComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
