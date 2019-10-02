import { Injectable } from "@angular/core";
import { saveAs } from "file-saver";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root"
})
export class BlogService {
  baseUrl = environment.adminApiUrl;
  constructor(private http: HttpClient) {}

  public download(file) {
    // Create url
    let url = `${this.baseUrl}/download/${file}`;

    return this.http.get(url, {
      responseType: "blob"
    });
  }
}
