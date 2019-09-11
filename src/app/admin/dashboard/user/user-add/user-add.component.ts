import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';

import { UserService } from '@app/services';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  addForm: FormGroup;

  loading = false;
  submitted = false;
  readyToUpload = false;

  croppedBlob: any;
  uploadingProgress = 0;

  imageChangedEvent: any;
  croppedImage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      profileUrl: [''],
      name: ['', Validators.required],
      email: ['', Validators.required],
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

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.addForm.controls; }

  addUser(userForm: NgForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addForm.invalid) {
        return;
    }

    this.loading = true;

    this.userService.create(userForm.value).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

  uploadProfile() {
    if (this.croppedBlob) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      this.userService.uploadUserImage(this.croppedBlob).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let res: any;
          res = event.body;
          if (res.success) {

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
