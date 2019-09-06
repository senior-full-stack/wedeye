import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserAddComponent } from '../user-add/user-add.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { ConfirmDlgComponent } from '@app/helpers/confirm-dlg/confirm-dlg.component';
import { UserService } from '@app/services';

@Component({
  selector: 'app-user-get',
  templateUrl: './user-get.component.html',
  styleUrls: ['./user-get.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGetComponent implements OnInit {

  searchText: string;
  users: any = [];

  constructor(
    private addUserDlg: MatDialog,
    private cdr: ChangeDetectorRef,
    private userService: UserService) { }

  ngOnInit() {
    this.getUsersFromServer();
  }

  getUsersFromServer() {
    this.userService.users().subscribe(users => {
      this.users = users;
      this.cdr.markForCheck();
    });
  }

  openAddUserDlg() {
    const dialogRef = this.addUserDlg.open(UserAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsersFromServer();
      }
    });
  }

  openEditUserDlg(index: number) {
    const dialogRef = this.addUserDlg.open(UserEditComponent, {
      data: {
        id: this.users[index]._id,
        name: this.users[index].name,
        email: this.users[index].email,
        password: this.users[index].password,
        phone: this.users[index].phone,
        address: this.users[index].address,
        type: this.users[index].type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsersFromServer();
      }
    });
  }

  public openConfirmDlg(index: number) {
    const dialogRef = this.addUserDlg.open(ConfirmDlgComponent, {
      data: {
        id: this.users[index]._id,
        name: this.users[index].name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsersFromServer();
      }
    });
  }

}
