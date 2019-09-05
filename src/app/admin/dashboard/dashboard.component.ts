import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../services';
import { User } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  currentUrl: string;
  currentUser: User;

  constructor(
    private router: Router,
    private location: Location,
    private authenticationService: AuthService) {
      router.events.subscribe((val) => {
        if (location.path() !== '') {
          this.currentUrl = location.path();
          console.log(this.currentUrl);
        }
      });
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

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/admin/login']);
  }

}
