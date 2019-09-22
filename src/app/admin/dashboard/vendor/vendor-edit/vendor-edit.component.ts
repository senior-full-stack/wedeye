import { Component, OnInit, Inject, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  styleUrls: ['./vendor-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorEditComponent implements OnInit {

  @ViewChild('pfContainer', {static: false}) pfContainer: ElementRef;
  @ViewChild('spContainer', {static: false}) spContainer: ElementRef;

  editForm: FormGroup;

  serviceCnt = 0;
  portfolioCnt = 0;
  serviceIndex = 0;
  portfolioIndex = 0;
  uploadingProgress = 0;

  loading = false;
  submitted = false;
  readyToUpload = false;
  uploadedProfile = false;

  vendor: any;
  croppedBlob: any;
  croppedImage: any;
  imageChangedEvent: any;

  vendorCategories = [];
  serviceCategories = [];

  firstElements = [];
  secondElements = [];
  thirdElements = [];
  delElements = [];

  baseUrl = environment.adminApiUrl;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    public dialogRef: MatDialogRef<VendorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.editForm = this.formBuilder.group({
        _id: [''],
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

  ngOnInit() {
    this.vendorService.findOneById(this.data.id).subscribe(res => {
      this.vendor = res;

      this.editForm.setValue ({
        _id: this.vendor._id,
        profileUrl: this.vendor.profileUrl ? this.vendor.profileUrl : '',
        title: this.vendor.title,
        category: this.vendor.category,
        capacity: this.vendor.capacity ? this.vendor.capacity : '',
        location: this.vendor.location ? this.vendor.location : '',
        workingSince: this.vendor.workingSince ? this.vendor.workingSince : '',
        introduction: this.vendor.introduction ? this.vendor.introduction : '',
        storeType: this.vendor.storeType ? this.vendor.storeType : '',
        propertyType: this.vendor.propertyType ? this.vendor.propertyType : '',
        parkingFacility: this.vendor.parkingFacility ? this.vendor.parkingFacility : '',
        status: this.vendor.status
      });

      if (this.vendor.portfolio.length > 0) {
        const lastPortfolio = this.vendor.portfolio[this.vendor.portfolio.length - 1];
        this.portfolioIndex = parseInt(lastPortfolio.id, 10) + 1;
      }

      if (this.vendor.services.length > 0) {
        const lastService = this.vendor.services[this.vendor.services.length - 1];
        this.serviceIndex = parseInt(lastService.id, 10) + 1;
      }

      // init portfolio
      for (const portfolio of this.vendor.portfolio) {
        this.addPortfolio(portfolio);
      }

      this.vendorService.serviceCategories().subscribe((ser: any) => {
        this.serviceCategories = ser.serviceCategories;

        // init services
        for (const service of this.vendor.services) {
          this.addServiceAndPolicy(service);
        }
      });
    });

    // get categories for vendor from a server
    this.vendorService.vendorCategories().subscribe((res: any) => {
      this.vendorCategories = res.vendorCategories;
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.editForm.controls; }

  editVendor(vendorForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editForm.invalid) {
        return;
    }

    this.loading = true;

    const formCtrl = vendorForm.value;

    const vendor = {
      _id: formCtrl._id,
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
      portfolio: this.vendor.portfolio,
      services: this.vendor.services,
      status: formCtrl.status
    };

    this.vendorService.update(vendor).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  // get name, file, delete elements for portfolio
  getElementsForPortfolio(container: any) {
    this.firstElements = container.getElementsByClassName('form-control');
    this.secondElements = container.getElementsByClassName('custom-file-input');
    this.thirdElements = container.getElementsByClassName('custom-file-label');
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
  addPortfolio(portfolio: any) {
    if (!portfolio) {
      this.vendor.portfolio.push(
        {
          id: this.portfolioIndex,
          title: '',
          urls: []
        }
      );
    }

    let ptName = 'Choose file';
    if (portfolio) {
      if (portfolio.urls.length > 0) {
        ptName = portfolio.urls[0].split('\\')[1];
      }
    }

    // make a html for a portfolio
    const html = `<div class="row row-${portfolio ? portfolio.id : this.portfolioIndex}"` +
        `style="margin-top: 10px"><div class="col-md-8">` +
        `<input type="text" class="form-control name&${portfolio ? portfolio.id : this.portfolioIndex}"` +
        `value="${portfolio ? portfolio.title : ''}" placeholder="enter name for portfolio"/>` +
        `</div><div class="col-md-3">` + `<div class="input-group"><div class="custom-file">` +
        `<input type="file" class="custom-file-input file&${portfolio ? portfolio.id : this.portfolioIndex}"` +
        `multiple> <label class="custom-file-label" style="overflow:hidden;height: 90%;` +
        `word-break: break-all;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-right: 70px;">` +
        `${ptName}</label></div></div>` +
        `</div><div class="col-md-1"><a class="btn btn&${portfolio ? portfolio.id : this.portfolioIndex}">` +
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

        for (const ele of this.vendor.portfolio) {
          if (ele.id === index) {
            ele.title = element.value;
            return;
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

        for (const ele of this.vendor.portfolio) {
          if (ele.id === index) {
            this.vendor.portfolio.splice(this.vendor.portfolio.indexOf(ele), 1);
          }
        }

        this.portfolioCnt = this.vendor.portfolio.length;
      });
    }

    this.portfolioCnt++;

    if (!portfolio) {
      this.portfolioIndex++;
    }
  }

  // add a service, price, policy
  addServiceAndPolicy(service: any) {
    if (!service) {
      this.vendor.services.push(
        {
          id: this.serviceIndex,
          category: '',
          title: '',
          description: ''
        }
      );
    }

    const filteredServiceCategories = this.serviceCategories.filter(item => {
      for (const cate of item.vendorCategories) {
        if (cate === this.f.category.value) {
          return item;
        }
      }
    });

    let options = '';
    for (const fService of filteredServiceCategories) {
      if (service && fService.title === service.category) {
        options = options + `<option value="${fService.title}" selected>${fService.title}</option>`;
      } else {
        options = options + `<option value="${fService.title}">${fService.title}</option>`;
      }
    }

    // make a html for a service
    const html = `<div class="row row-${service ? service.id : this.serviceIndex}"` +
        `style="margin-top: 10px"><div class="col-md-11">` +
        `<select class="form-control category category&${service ? service.id : this.serviceIndex}">` +
        `${options}</select></div><div class="col-md-1">` +
        `<a class="btn btn&${service ? service.id : this.serviceIndex}">` +
        `<i class="fa fa-minus-circle"></i></a></div>` +
        `<div class="col-md-11" style="margin-top:10px;margin-left:20px"><input type="text"` +
        `class="form-control title title&${service ? service.id : this.serviceIndex}"` +
        `value="${service ? service.title : ''}"` +
        `placeholder="enter service & pricing & policy's title"/></div>` +
        `<div class="col-md-11" style="margin-top:10px;margin-left:20px"><textarea type="text"` +
        `class="form-control description description&${service ? service.id : this.serviceIndex}"` +
        `placeholder="enter service & pricing & policy's description">${service ? service.description : ''}</textarea>` +
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

        for (const ele of this.vendor.services) {
          if (ele.id === index) {
            ele.category = element.value;
            return;
          }
        }
      });
    }

    // loop elements for title
    for (const element of this.secondElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        for (const ele of this.vendor.services) {
          if (ele.id === index) {
            ele.title = element.value;
            return;
          }
        }
      });
    }

    // loop elements for description
    for (const element of this.thirdElements) {
      element.addEventListener('change', (e) => {
        const index = parseInt(element.className.split('&')[1], 10);
        for (const ele of this.vendor.services) {
          if (ele.id === index) {
            ele.description = element.value;
            return;
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

        for (const ele of this.vendor.services) {
          if (ele.id === index) {
            this.vendor.services.splice(this.vendor.services.indexOf(ele), 1);
          }
        }

        this.serviceCnt = this.vendor.services.length;
      });
    }

    this.serviceCnt++;

    if (!service) {
      this.serviceIndex++;
    }
  }

  // remove all childrens of service section when the vendor's category is changed
  changeCategory() {
    this.serviceCnt = 0;
    this.serviceIndex = 0;
    this.vendor.services = [];

    let children = this.spContainer.nativeElement.lastElementChild;
    while (children) {
      children.remove();
      children = this.spContainer.nativeElement.lastElementChild;
    }

    this.cdr.markForCheck();
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
            this.thirdElements[index].textContent = portfolioFiles[0].name;
          }

          for (const ele of this.vendor.portfolio) {
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

  uploadProfile() {
    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.vendorService.uploadVendorImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {
            this.uploadedProfile = true;
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
    this.uploadedProfile = false;
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
