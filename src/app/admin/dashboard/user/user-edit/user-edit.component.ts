import { Component, OnInit, Inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  FormControl
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserService } from "@app/services";
import { Subject } from "rxjs";
import * as moment from "moment";

import { HttpEventType, HttpResponse } from "@angular/common/http";
import { ImageCroppedEvent } from "ngx-image-cropper";

import { environment } from "@environments/environment";

import { ValidateEmailNotTaken } from "../../../../directives/async-email-not-taken.validator";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"]
})
export class UserEditComponent implements OnInit {
  error = "";
  editForm: FormGroup;

  loading = false;
  submitted = false;
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
  user: any;

  baseUrl = environment.adminApiUrl;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.formBuilder.group({
      _id: [""],
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
  }

  ngOnInit() {
    this.userService.findOneById(this.data.id).subscribe(res => {
      this.user = res;

      this.editForm.setValue({
        _id: this.user._id,
        personalPhoto: this.user.personalPhoto ? this.user.personalPhoto : "",
        type: this.user.type,
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        confirmPassword: this.user.password,
        phone: this.user.phone ? this.user.phone : "",
        country: this.user.country ? this.user.country : "",
        state: this.user.state ? this.user.state : "",
        city: this.user.city ? this.user.city : "",
        addressLine1: this.user.addressLine1 ? this.user.addressLine1 : "",
        addressLine2: this.user.addressLine2 ? this.user.addressLine2 : "",
        pincode: this.user.pincode ? this.user.pincode : "",
        age: this.user.age ? this.user.age : "",
        userType: this.user.userType ? this.user.userType : "",
        relationship: this.user.relationship ? this.user.relationship : "",
        weddingPhoto: this.user.weddingPhoto ? this.user.weddingPhoto : "",
        weddingDate: this.user.weddingDate
          ? moment(this.user.weddingDate).format("YYYY-MM-DD")
          : "",
        color: this.user.color ? this.user.color : "",
        locationLatitude: this.user.locationLatitude
          ? this.user.locationLatitude
          : "",
        locationLongitude: this.user.locationLongitude
          ? this.user.locationLongitude
          : "",
        locationAddress: this.user.locationAddress
          ? this.user.locationAddress
          : "",
        partnerPhoto: this.user.partnerPhoto ? this.user.partnerPhoto : "",
        partnerType: this.user.partnerType ? this.user.partnerType : "",
        partnerAge: this.user.partnerAge ? this.user.partnerAge : "",
        partnerCountry: this.user.partnerCountry
          ? this.user.partnerCountry
          : "",
        partnerState: this.user.partnerState ? this.user.partnerState : "",
        partnerCity: this.user.partnerCity ? this.user.partnerCity : "",
        partnerPincode: this.user.partnerPincode
          ? this.user.partnerPincode
          : "",
        partnerAddressLine1: this.user.partnerAddressLine1
          ? this.user.partnerAddressLine1
          : "",
        partnerAddressLine2: this.user.partnerAddressLine2
          ? this.user.partnerAddressLine2
          : "",
        status: this.user.status ? this.user.status : "",
        isActive: this.user.isActive ? this.user.isActive : "",
        createdDate: this.user.createdDate
          ? moment(this.user.createdDate).format("YYYY-MM-DD")
          : "",
        createdBy: this.user.createdBy ? this.user.createdBy : "",
        modifiedDate: this.user.modifiedDate
          ? moment(this.user.modifiedDate).format("YYYY-MM-DD")
          : "",
        modifiedBy: this.user.modifiedBy ? this.user.modifiedBy : "",
        noOfRequestSent: this.user.noOfRequestSent
          ? this.user.noOfRequestSent
          : "",
        isPaidUser: this.user.isPaidUser ? this.user.isPaidUser : "",
        amountPaid: this.user.amountPaid ? this.user.amountPaid : "",
        paidDate: this.user.paidDate
          ? moment(this.user.paidDate).format("YYYY-MM-DD")
          : ""
      });
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup["controls"] {
    return this.editForm.controls;
  }

  updateUser(userForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.update(userForm.value).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  confirmUrl(url: string) {
    return url.replace(/.png/, "");
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
            this.editForm.get("personalPhoto").setValue(res.path);
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
            this.editForm.get("weddingPhoto").setValue(res.path);
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
            this.editForm.get("partnerPhoto").setValue(res.path);
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
