import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        console.log(res);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(res));
        return res;
  }));
  }

  update(user: any) {
    const params = new HttpParams();
    params.set('id', user._id);

    return this.http.post(`${environment.adminApiUrl}/users`, user, { params });
  }

  deleteById(id: string) {
    const params = new HttpParams();
    params.set('id', id);

    return this.http.delete(`${environment.adminApiUrl}/users`, { params });
  }
}
