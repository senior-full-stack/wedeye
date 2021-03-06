﻿﻿﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.getCurrentUser();
  }

  public get currentUserValue(): User {
    this.getCurrentUser();
    return this.currentUserSubject.value;
  }

  getCurrentUser() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.adminApiUrl}/api/users/auth`,
        JSON.stringify({email, password }))
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }));
  }

  logout() {
      // remove user from local storage to log user out
      sessionStorage.removeItem('currentUser');
  }
}
