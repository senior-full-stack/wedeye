import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  AfterContentInit,
  AfterViewChecked,
  AfterContentChecked
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  FormControl
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { Subject } from "rxjs";

import { UserService } from "@app/services";
import { HttpEventType, HttpResponse } from "@angular/common/http";

import { ValidateEmailNotTaken } from "../../../../directives/async-email-not-taken.validator";

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.scss"]
})
export class UserAddComponent implements OnInit {
  addForm: FormGroup;

  loading = false;
  submitted = false;
  tabs = "personal";
  readyToUpload = false;
  uploadedProfile = false;
  uploadedWedding = false;
  uploadedPartner = false;

  croppedBlob: any;
  uploadingProgress = 0;

  imageChangedEvent: any;
  imageChangedEvent1: any;
  imageChangedEvent2: any;

  croppedImage: any;
  croppedImage1: any;
  croppedImage2: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      personalPhoto: [""],
      type: new FormControl("shaadie"),
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      phone: [""],
      country: [""],
      state: [""],
      city: [""],
      addressLine1: [""],
      addressLine2: [""],
      pincode: [""],
      age: [""],
      userType: new FormControl("groom"),
      relationship: [""],
      weddingPhoto: [""],
      weddingDate: new FormControl(""),
      color: [""],
      locationLatitude: [""],
      locationLongitude: [""],
      locationAddress: [""],
      partnerPhoto: [""],
      partnerType: [""],
      partnerAge: [""],
      partnerCountry: [""],
      partnerState: [""],
      partnerCity: [""],
      partnerPincode: [""],
      partnerAddressLine1: [""],
      partnerAddressLine2: [""],
      status: new FormControl("1"),
      isActive: [""],
      createdDate: new FormControl(""),
      createdBy: [""],
      modifiedDate: new FormControl(""),
      modifiedBy: [""],
      noOfRequestSent: [""],
      isPaidUser: [""],
      amountPaid: [""],
      paidDate: new FormControl("")
    });

    this.f.email.setAsyncValidators(
      ValidateEmailNotTaken.createValidator(this.userService)
    );
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup["controls"] {
    return this.addForm.controls;
  }

  addUser(userForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

    this.loading = true;

    if (userForm.value.userType !== 'other') {
      userForm.value.relationship = '';
    }

    this.userService.create(userForm.value).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }
  // get url for Personal Photo
  uploadProfile() {
    this.uploadingProgress = 0;

    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.userService.uploadUserImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {
            this.uploadedProfile = true;
            this.addForm.get("personalPhoto").setValue(res.path);
          }
        }

        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round((100 * event.loaded) / event.total);

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
  // get url for Wedding Photo
  uploadUser() {
    this.uploadingProgress = 0;

    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.userService.uploadUserImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {
            this.uploadedWedding = true;
            this.addForm.get("weddingPhoto").setValue(res.path);
          }
        }

        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round((100 * event.loaded) / event.total);

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
  // get url for Partner Photo
  uploadPartner() {
    this.uploadingProgress = 0;

    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.userService.uploadUserImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {
            this.uploadedPartner = true;
            this.addForm.get("partnerPhoto").setValue(res.path);
          }
        }

        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round((100 * event.loaded) / event.total);

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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    this.readyToUpload = true;
    this.uploadedProfile = false;
  }

  fileChangeEvent1(event: any): void {
    this.imageChangedEvent1 = event;
    console.log("wedding input change");
    this.readyToUpload = true;
    this.uploadedWedding = false;
  }

  fileChangeEvent2(event: any): void {
    this.imageChangedEvent2 = event;
    console.log("partner input change");
    this.readyToUpload = true;
    this.uploadedPartner = false;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedBlob = event.file;
  }

  imageCropped1(event: ImageCroppedEvent) {
    this.croppedImage1 = event.base64;
    this.croppedBlob = event.file;
  }

  imageCropped2(event: ImageCroppedEvent) {
    this.croppedImage2 = event.base64;
    this.croppedBlob = event.file;
  }

  changeTabs(event: any) {
    this.tabs = event;
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
