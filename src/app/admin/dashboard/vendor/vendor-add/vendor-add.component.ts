import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('spContainer', {static: false}) spContainer: ElementRef;

  addForm: FormGroup;

  serviceIndex = 0;
  serviceCnt = 0;
  portfolioCnt = 0;
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
  services = [];

  firstElements = [];
  secondElements = [];
  thirdElements = [];
  delElements = [];

  constructor(
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    public dialogRef: MatDialogRef<VendorAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      // get categories for vendor from a server
      this.vendorService.vendorCategories().subscribe((res: any) => {
        this.vendorCategories = res.vendorCategories;
      });

      // get categories for service, price and policy from a server
      this.vendorService.serviceCategories().subscribe((res: any) => {
        this.serviceCategories = res.serviceCategories;
      });
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
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.addForm.controls; }

  // add a vendor to the database
  addVendor(vendorForm) {
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
      portfolio: this.checkEmptyInArray(this.portfolio),
      services: this.checkEmptyInArray(this.services),
      status: formCtrl.status
    };

    this.vendorService.create(vendor).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  // check empty element in array
  checkEmptyInArray(array: any[]) {
    const items = [];
    for (const item of array) {
      if (item.title !== '') {
        items.push(item);
      }
    }

    return items;
  }

  // get name, file, delete elements for portfolio
  getElementsForPortfolio(container: any) {
    this.firstElements = container.getElementsByClassName('form-control');
    this.secondElements = container.getElementsByClassName('custom-file-input');
    this.delElements = container.getElementsByTagName('a');
  }

  // get a category, title, description
  getElementsForService(container: any) {
    this.firstElements = container.getElementsByClassName('category');
    this.secondElements = container.getElementsByClassName('title');
    this.thirdElements = container.getElementsByClassName('description');
    this.delElements = container.getElementsByTagName('a');
  }

  // add a portfolio
  addPortfolio() {
    this.portfolio.push(
      {
        id: this.portfolioIndex,
        title: '',
        urls: []
      }
    );

    // make a html for a portfolio
    const html = `<div class="row row-${this.portfolioIndex}" style="margin-top: 10px"><div class="col-md-8">` +
        `<input type="text" class="form-control name&${this.portfolioIndex}"` +
        `placeholder="enter name for portfolio"/>` +
        `</div><div class="col-md-3"><div class="input-group"><div class="custom-file">` +
        `<input type="file" class="custom-file-input file&${this.portfolioIndex}"` +
        `multiple> <label class="custom-file-label label&${this.portfolioIndex}" style="overflow:hidden;height: 90%;` +
        `word-break: break-all;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-right: 70px;">` +
        `Choose file</label></div></div>` +
        `</div><div class="col-md-1"><a class="btn btn&${this.portfolioIndex}">` +
        `<i class="fa fa-minus-circle"></i></a></div>` +
        `<div style="width:100%;height:1px;margin:10px 15px;background-color:lightgray !important"></div></div>`;

    const container = this.pfContainer.nativeElement;
    container.insertAdjacentHTML('beforeend', html);

    // get name, file, delete elements for portfolio
    this.getElementsForPortfolio(container);

    // loop elements for the name of portfolio
    for (const element of this.firstElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        for (const ele of this.portfolio) {
          if (ele.id === index) {
            ele.title = element.value;
          }
        }
      });
    }

    // loop elements for the file of portfolio
    for (const element of this.secondElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        this.uploadPortfolio(e, index);
      });
    }

    // loop elements for deleting
    for (const element of this.delElements) {
      element.addEventListener('click', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);

        const dEles = container.getElementsByClassName(`row-${index}`);

        if (dEles.length > 0) {
          container.getElementsByClassName(`row-${index}`)[0].remove();
        }

        // get name, file, delete elements for portfolio
        this.getElementsForPortfolio(container);

        for (const ele of this.portfolio) {
          if (ele.id === index) {
            this.portfolio.splice(this.portfolio.indexOf(ele), 1);
          }
        }

        this.portfolioCnt = this.portfolio.length;
      });
    }

    this.portfolioCnt++;
    this.portfolioIndex++;
  }

  // add a service, price, policy
  addServiceAndPolicy() {
    this.services.push(
      {
        id: this.serviceIndex,
        category: '',
        title: '',
        description: ''
      }
    );

    const services = this.serviceCategories.filter(item => {
      for (const category of item.vendorCategories) {
        if (category === this.f.category.value) {
          return item;
        }
      }
    });

    let options = '';
    for (const service of services) {
      options = options + `<option value="${service.title}">${service.title}</option>`;
    }

    // make a html for a service
    const html = `<div class="row row-${this.serviceIndex}" style="margin-top: 10px">` +
        `<div class="col-md-11"><select class="form-control category category&${this.serviceIndex}">` +
        `${options}</select></div><div class="col-md-1">` +
        `<a class="btn btn&${this.serviceIndex}">` +
        `<i class="fa fa-minus-circle"></i></a></div>` +
        `<div class="col-md-11" style="margin-top:10px;margin-left:20px"><input type="text"` +
        `class="form-control title title&${this.serviceIndex}"` +
        `placeholder="enter service & pricing & policy's title"/></div>` +
        `<div class="col-md-11" style="margin-top:10px;margin-left:20px"><textarea type="text"` +
        `class="form-control description description&${this.serviceIndex}"` +
        `placeholder="enter service & pricing & policy's description"></textarea>` +
        `</div><div style="width:100%;height:1px;margin:10px 15px;background-color:lightgray !important">` +
        `</div></div>`;

    const container = this.spContainer.nativeElement;
    container.insertAdjacentHTML('beforeend', html);

    // get a category, title, description
    this.getElementsForService(container);

    // loop elements for category
    for (const element of this.firstElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        for (const ele of this.services) {
          if (ele.id === index) {
            ele.category = element.value;
          }
        }
      });
    }

    // loop elements for title
    for (const element of this.secondElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        for (const ele of this.services) {
          if (ele.id === index) {
            ele.title = element.value;
          }
        }
      });
    }

    // loop elements for description
    for (const element of this.thirdElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        for (const ele of this.services) {
          if (ele.id === index) {
            ele.description = element.value;
          }
        }
      });
    }

    // loop elements for deleting
    for (const element of this.delElements) {
      element.addEventListener('click', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);

        const dEles = container.getElementsByClassName(`row-${index}`);

        if (dEles.length > 0) {
          container.getElementsByClassName(`row-${index}`)[0].remove();
        }

        // get name, file, delete elements for portfolio
        this.getElementsForService(container);

        for (const ele of this.services) {
          if (ele.id === index) {
            this.services.splice(this.services.indexOf(ele), 1);
          }
        }

        this.serviceCnt = this.services.length;
      });
    }

    this.serviceCnt++;
    this.serviceIndex++;
  }

  // remove all childrens of service section when the vendor's category is changed
  changeCategory() {
    this.serviceCnt = 0;
    this.serviceIndex = 0;
    this.services = [];

    let children = this.spContainer.nativeElement.lastElementChild;
    while (children) {
      children.remove();
      children = this.spContainer.nativeElement.lastElementChild;
    }
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
  uploadPortfolio(element: any, index: number) {
    this.uploadingProgress = 0;
    const portfolioFiles = element.target.files;

    // create a new progress-subject for every file
    const progress = new Subject<number>();

    this.vendorService.uploadPortfolio(portfolioFiles).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        let res: any;
        res = event.body;
        if (res.success) {
          if (portfolioFiles.length > 0) {
            const container = this.pfContainer.nativeElement;
            const dEles = container.getElementsByClassName(`label&${index}`);
            dEles[0].textContent = portfolioFiles[0].name;
          }

          for (const ele of this.portfolio) {
            if (ele.id === index) {
              ele.urls = res.path;
              return;
            }
          }
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
