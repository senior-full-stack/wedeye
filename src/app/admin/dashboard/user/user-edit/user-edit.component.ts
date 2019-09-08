import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '@app/services';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      _id: [this.data.id],
      name: [this.data.name, Validators.required],
      email: [this.data.email, Validators.required],
      password: [this.data.password, Validators.required],
      type: new FormControl(this.data.type),
      relation: [this.data.relation],
      weddingDate: new FormControl(this.data.weddingDate.replace(' ', 'T')),
      address: [this.data.address],
      phone: [this.data.phone],
      status: new FormControl(this.data.status)
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup['controls'] { return this.loginForm.controls; }

  updateUser(userForm: NgForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;

    this.userService.update(userForm.value).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }
}
