import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

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


@NgModule({
  declarations: [
    DashboardComponent,
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
    DashboardRoutingModule,
    Ng2SearchPipeModule
  ]
})
export class DashboardModule { }
