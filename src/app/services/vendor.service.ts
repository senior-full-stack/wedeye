import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }

  vendors(searchText: string, page: number, status: number) {
    return this.http.post(`${environment.adminApiUrl}/api/vendors/search/${page}`, {searchText, status});
  }

  create(vendor: any) {
    return this.http.post(`${environment.adminApiUrl}/api/vendors`, vendor)
      .pipe(map(res => {
        return res;
    }));
  }

  update(vendor: any) {
    return this.http.patch(`${environment.adminApiUrl}/api/vendors/${vendor._id}`, vendor);
  }

  deleteById(id: string) {
    return this.http.delete(`${environment.adminApiUrl}/api/vendors/${id}`);
  }

  uploadVendorImage(file: any) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', `${environment.adminApiUrl}/api/upload`, formData, {
      reportProgress: true
    });

    // send the http-request and subscribe for progress-updates
    return this.http.request(req);
  }

  uploadPortfolio(files: any[]) {
    const formData = new FormData();

    console.log(files);

    for (var i = 0; i < files.length; i++) {
      formData.append('files[]', files[i], files[i].name);
    }

    const req = new HttpRequest('POST', `${environment.adminApiUrl}/api/upload`, formData, {
      reportProgress: true
    });

    // send the http-request and subscribe for progress-updates
    return this.http.request(req);
  }

  vendorCategories() {
    return this.http.get(`${environment.adminApiUrl}/api/vendors/vendor-category`);
  }

  serviceCategories() {
    return this.http.get(`${environment.adminApiUrl}/api/vendors/service-category`);
  }

  policyCategories() {
    return this.http.get(`${environment.adminApiUrl}/api/vendors/policy-category`);
  }
}
