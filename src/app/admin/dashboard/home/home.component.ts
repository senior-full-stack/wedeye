import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { saveAs } from "file-saver";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { environment } from "@environments/environment";
import { BlogService } from "@app/services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  downLoading = false;
  fileUrl = "";
  baseUrl = environment.adminApiUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private blogService: BlogService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  download() {
    let filename = "app.txt";
    this.blogService.download(filename).subscribe(
      data => {
        saveAs(data, filename);
      },
      err => {
        console.error(err);
      }
    );
  }
}
