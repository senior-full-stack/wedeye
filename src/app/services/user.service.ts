import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { map } from "rxjs/operators";

import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  users(searchText: string, page: number, status: number) {
    return this.http.post(
      `${environment.adminApiUrl}/api/users/search/${page}`,
      { searchText, status }
    );
  }

  getAllUsers() {
    return this.http.get(`${environment.adminApiUrl}/api/users/all`);
  }

  setAllUsers(data: string) {
    return this.http.post(`${environment.adminApiUrl}/api/users/all`, {
      data: data
    });
  }

  findOneById(id: string) {
    return this.http.get(`${environment.adminApiUrl}/api/users/${id}`);
  }

  checkEmailNotTaken(email: string) {
    return this.http.get(`${environment.adminApiUrl}/api/users?email=${email}`);
  }

  create(user: any) {
    return this.http.post(`${environment.adminApiUrl}/api/users`, user).pipe(
      map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem("currentUser", JSON.stringify(res));
        return res;
      })
    );
  }

  update(user: any) {
    return this.http.patch(
      `${environment.adminApiUrl}/api/users/${user._id}`,
      user
    );
  }

  deleteById(id: string) {
    return this.http.delete(`${environment.adminApiUrl}/api/users/${id}`);
  }

  uploadUserImage(file: any) {
    const formData: FormData = new FormData();
    formData.append("file", file, file.name);

    const req = new HttpRequest(
      "POST",
      `${environment.adminApiUrl}/api/upload`,
      formData,
      {
        reportProgress: true
      }
    );

    // send the http-request and subscribe for progress-updates
    return this.http.request(req);
  }
}
