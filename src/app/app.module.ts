import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './admin/login/login.component';
import { DashboardModule } from './admin/dashboard/dashboard.module';

import { JwtInterceptor, ErrorInterceptor } from '@app/helpers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDlgComponent } from './helpers/confirm-dlg/confirm-dlg.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmDlgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardModule,
    MatDialogModule,
    SlimLoadingBarModule,
    BrowserAnimationsModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [
    ConfirmDlgComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
