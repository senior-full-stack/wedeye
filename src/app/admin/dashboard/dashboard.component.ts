import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../services';
import { User } from '../../models';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  isExpanded: boolean;
  currentUrl: string;
  currentUser: User;

  constructor(
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthService) {
    this.isExpanded = false;

    router.events.subscribe((val) => {
      if (location.path() !== '') {
        this.currentUrl = location.path();
      }
    });
  }

  linkUrl(url: string) {
    this.isExpanded = false;

    this.router.navigate([`/admin/dashboard/${url}`]);
  }

  getCurrentUrl() {
    if (this.currentUrl.includes('/user')) {
      return 'user';
    } else if (this.currentUrl.includes('/vendor')) {
      return 'vendor';
    } else if (this.currentUrl.includes('/blog')) {
      return 'blog';
    } else if (this.currentUrl.includes('/report')) {
      return 'report';
    }
  }

  openNavbar() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/admin/login']);
  }

}
