import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';

import { VendorService } from '@app/services';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.scss']
})
export class VendorEditComponent implements OnInit {

  editForm: FormGroup;

  loading = false;
  submitted = false;
  readyToUpload = false;

  croppedBlob: any;
  uploadingProgress = 0;

  imageChangedEvent: any;
  croppedImage: any;
  vendorCategories = [];

  baseUrl = environment.adminApiUrl;

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    public dialogRef: MatDialogRef<VendorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      _id: [this.data.id],
      profileUrl: [this.data.profileUrl ? this.data.profileUrl : ''],
      title: [this.data.title, Validators.required],
      category: new FormControl(this.data.category),
      capacity: [this.data.capacity ? this.data.capacity : ''],
      location: [this.data.location ? this.data.location : ''],
      workingSince: [this.data.workingSince ? this.data.workingSince : ''],
      introduction: [this.data.introduction ? this.data.introduction : ''],
      storeType: [this.data.storeType ? this.data.storeType : ''],
      propertyType: [this.data.propertyType ? this.data.propertyType : ''],
      parkingFacility: [this.data.parkingFacility ? this.data.parkingFacility : ''],
      status: new FormControl(this.data.status)
    });

    this.vendorService.vendorCategories().subscribe((res: any) => {
      this.vendorCategories = res.vendorCategories;
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.editForm.controls; }

  editVendor(vendorForm: NgForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editForm.invalid) {
        return;
    }

    this.loading = true;

    this.vendorService.update(vendorForm.value).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  uploadProfile() {
    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.vendorService.uploadVendorImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {

            this.editForm.get('profileUrl').setValue(res.path);
          }
        }

        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      progress.subscribe(pro => {
        this.uploadingProgress = pro;
      });
    }
  }

  confirmUrl(url: string) {
    return url.replace(/.png/, '');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    this.readyToUpload = true;
    this.uploadingProgress = 0;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedBlob = event.file;
  }

  imageLoaded() {
      // show cropper
  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }
}
