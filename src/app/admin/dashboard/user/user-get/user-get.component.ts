import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import 'moment/locale/pt-br';

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
  localUsers: any = [];

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
      this.localUsers = users;
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
        type: this.users[index].type,
        relation: this.users[index].relation,
        phone: this.users[index].phone,
        address: this.users[index].address,
        weddingDate: this.users[index].weddingDate,
        createdDate: this.users[index].createdDate,
        status: this.users[index].status
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsersFromServer();
      }
    });
  }

  openConfirmDlg(index: number) {
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

  filterUsers(type: string) {
    if (type !== '0' && type !== '7') {
      this.users = this.localUsers.filter(user => user.status === type);
    } else if (type === '0') {
      this.users = this.localUsers;
    } else {
      this.users = this.localUsers.filter(user => {
        const createdDate = moment(user.createdDate);
        const now = moment();
        const diff = now.diff(createdDate, 'days');
        alert(diff);
      });
    }
  }
}
