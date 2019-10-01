import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-blog-get",
  templateUrl: "./blog-get.component.html",
  styleUrls: ["./blog-get.component.scss"]
})
export class BlogGetComponent implements OnInit {

  downLoading = false;
  fileUrl;
  
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const data = "some text";

    const blob = new Blob([data], { type: "application/octet-stream" });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }

  download() {}
}
