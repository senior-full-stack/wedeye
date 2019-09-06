import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserAddComponent } from '../user-add/user-add.component';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-get',
  templateUrl: './user-get.component.html',
  styleUrls: ['./user-get.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGetComponent implements OnInit {

  searchText: string;
  users = [
    { name: 'Mr. Nice', email: 'mrnice@gamil.com', password: 'password1', phone: '123', address: 'address1', type: 'vendor' },
    { name: 'Narco', email: 'narco@gamil.com', password: 'password2', phone: '1232323', address: 'address2', type: 'client' },
    { name: 'Jackie', email: 'narco@gamil.com', password: 'password2', phone: '1232323', address: 'address2', type: 'client' }
  ];

  constructor(
    private addUserDlg: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  openAddUserDlg() {
    const dialogRef = this.addUserDlg.open(UserAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Add User Dlg: ${result}`);
    });
  }

  openEditUserDlg(index: number) {
    const dialogRef = this.addUserDlg.open(UserEditComponent, {
      data: {
        name: this.users[index].name,
        email: this.users[index].email,
        password: this.users[index].password,
        phone: this.users[index].phone,
        address: this.users[index].address
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Add User Dlg: ${result}`);
    });
  }

  public openConfirmDlg(id: string) {

  }

}
