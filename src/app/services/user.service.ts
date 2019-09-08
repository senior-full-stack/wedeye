import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  users() {
    return this.http.get(`${environment.adminApiUrl}/users`);
  }

  create(user: any) {
    return this.http.post(`${environment.adminApiUrl}/users`, user)
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(res));
        return res;
  }));
  }

  update(user: any) {
    return this.http.patch(`${environment.adminApiUrl}/users/${user._id}`, user);
  }

  deleteById(id: string) {
    return this.http.delete(`${environment.adminApiUrl}/users/${id}`);
  }
}
