import { Component, OnInit, Inject, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';

import { VendorService } from '@app/services';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.scss']
})
export class VendorAddComponent implements OnInit {

  @ViewChild('pfContainer', {static: false}) pfContainer: ElementRef;

  addForm: FormGroup;

  portfolioIndex = 0;
  uploadingProgress = 0;

  loading = false;
  submitted = false;
  readyToUpload = false;
  uploadedProfile = false;

  croppedBlob: any;
  croppedImage: any;
  imageChangedEvent: any;

  vendorCategories = [];
  serviceCategories = [];
  policyCategories = [];

  portfolio = [];

  portfolioHtml = '';

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    public dialogRef: MatDialogRef<VendorAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      profileUrl: [''],
      title: ['', Validators.required],
      category: new FormControl('venues'),
      capacity: [''],
      location: [''],
      workingSince: [''],
      introduction: [''],
      storeType: [''],
      propertyType: [''],
      parkingFacility: [''],
      status: new FormControl('1')
    });

    this.vendorService.vendorCategories().subscribe((res: any) => {
      this.vendorCategories = res.vendorCategories;
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.addForm.controls; }

  // add a vendor to the database
  addVendor(vendorForm: NgForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addForm.invalid) {
        return;
    }

    this.loading = true;

    const formCtrl = vendorForm.value;

    const vendor = {
      title: formCtrl.title,
      profileUrl: formCtrl.profileUrl,
      category: formCtrl.category,
      capacity: formCtrl.capacity,
      location: formCtrl.location,
      workingSince: formCtrl.workingSince,
      introduction: formCtrl.introduction,
      storeType: formCtrl.storeType,
      propertyType: formCtrl.propertyType,
      parkingFacility: formCtrl.parkingFacility,
      portfolio: this.portfolio,
      status: formCtrl.status
    };

    this.vendorService.create(vendor).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  // add a portfolio
  addPortfolio() {
    this.portfolio.push(
      {
        name: '',
        urls: []
      }
    );

    const html = `<div class="row" style="margin-top: 10px"><div class="col-md-8">` +
        `<input type="text" class="form-control"` +
        `placeholder="enter name for portfolio - ${this.portfolioIndex + 1}"/>` +
        `</div><div class="col-md-4"><div class="input-group"><div class="custom-file">` +
        `<input type="file" class="custom-file-input"` +
        `multiple> <label class="custom-file-label">Choose file</label>` +
        `</div></div></div></div>`;

    this.pfContainer.nativeElement.insertAdjacentHTML('beforeend', html);

    const elements = this.pfContainer.nativeElement.getElementsByTagName('input');
    elements[(this.portfolioIndex * 2)].addEventListener('change', (e) => {
      this.portfolio[this.portfolioIndex - 1].name = e.target.value;
    });

    elements[(this.portfolioIndex * 2) + 1].addEventListener('change', (e) => {
      this.uploadPortfolio(e);
    });

    this.portfolioIndex++;
  }

  // upload the profile for a vendor
  uploadProfile() {
    this.uploadingProgress = 0;

    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.vendorService.uploadVendorImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {
            this.uploadedProfile = true;
            this.addForm.get('profileUrl').setValue(res.path);
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

  // upload portfolio for past works
  uploadPortfolio(element: any) {
    this.uploadingProgress = 0;
    const portfolioFiles = element.target.files;

    // create a new progress-subject for every file
    const progress = new Subject<number>();

    this.vendorService.uploadPortfolio(portfolioFiles).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        let res: any;
        res = event.body;
        if (res.success) {
          this.portfolio[this.portfolioIndex - 1].urls = res.path;
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

  // event for the imagecropper
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;

    this.readyToUpload = true;
    this.uploadedProfile = false;
  }

  // event for the imagecropper
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedBlob = event.file;
  }

  // event for the imagecropper
  imageLoaded() {
      // show cropper
  }
  // event for the imagecropper
  cropperReady() {
      // cropper ready
  }
  // event for the imagecropper
  loadImageFailed() {
      // show message
  }

}
