import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
