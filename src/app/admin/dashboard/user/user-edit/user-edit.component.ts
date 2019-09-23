import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '@app/services';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { environment } from '@environments/environment';

import { ValidateEmailNotTaken } from '../../../../directives/async-email-not-taken.validator';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  error = '';
  editForm: FormGroup;

  loading = false;
  submitted = false;
  readyToUpload = false;
  uploadedProfile = false;

  imageChangedEvent: any;
  croppedImage: any;
  croppedBlob: any;
  user: any;

  uploadingProgress = 0;

  baseUrl = environment.adminApiUrl;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.editForm = this.formBuilder.group({
        _id: [''],
        profileUrl: [''],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        type: new FormControl('vendor'),
        relation: [''],
        weddingDate: new FormControl(''),
        address: [''],
        phone: [''],
        status: new FormControl('1')
      });
  }

  ngOnInit() {
    this.userService.findOneById(this.data.id).subscribe(res => {
      this.user = res;

      this.editForm.setValue(
        {
          _id: this.user._id,
          profileUrl: this.user.profileUrl ? this.user.profileUrl : '',
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          confirmPassword: this.user.password,
          type: this.user.type,
          relation: this.user.relation ? this.user.relation : '',
          weddingDate: this.user.weddingDate ? moment(this.user.weddingDate).format('YYYY-MM-DD') : '',
          address: this.user.address ? this.user.address : '',
          phone: this.user.phone ? this.user.phone : '',
          status: this.user.status ? this.user.status : ''
        });
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.editForm.controls;}

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
