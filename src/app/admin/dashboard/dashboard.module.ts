import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { MatDialogModule } from '@angular/material';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { UserGetComponent } from './user/user-get/user-get.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { BlogAddComponent } from './blog/blog-add/blog-add.component';
import { BlogEditComponent } from './blog/blog-edit/blog-edit.component';
import { BlogGetComponent } from './blog/blog-get/blog-get.component';
import { VendorGetComponent } from './vendor/vendor-get/vendor-get.component';
import { VendorEditComponent } from './vendor/vendor-edit/vendor-edit.component';
import { VendorAddComponent } from './vendor/vendor-add/vendor-add.component';
import { ReportGetComponent } from './report/report-get/report-get.component';
import { UserAddComponent } from './user/user-add/user-add.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserAddComponent,
    UserGetComponent,
    UserEditComponent,
    BlogAddComponent,
    BlogEditComponent,
    BlogGetComponent,
    VendorGetComponent,
    VendorEditComponent,
    VendorAddComponent,
    ReportGetComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [
    UserAddComponent
  ]
})
export class DashboardModule { }
