import { Component, OnInit, Inject } from "@angular/core";
import { Location } from "@angular/common";
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
@Component({
  selector: "app-admins",
  templateUrl: "./admins.component.html",
  styleUrls: ["./admins.component.scss"]
})
export class AdminsComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  user: any;
  name = "admin";
  baseUrl = environment.adminApiUrl;
  constructor(
    private location: Location,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      _id: [""],
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.userService.findAdminData(this.name).subscribe(res => {
      this.user = res;
      this.loginForm.setValue({
        _id: this.user._id,
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        confirmPassword: this.user.password
      });
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup["controls"] {
    return this.loginForm.controls;
  }

  updateAdmin(userForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.update(userForm.value).subscribe((res: any) => {
      if (res.success) {
        this.location.back();
      }
    });
  }

  back() {
    this.location.back();
  }
}
