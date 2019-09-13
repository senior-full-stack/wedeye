import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import 'moment/locale/pt-br';

import { VendorAddComponent } from '../vendor-add/vendor-add.component';
import { VendorEditComponent } from '../vendor-edit/vendor-edit.component';
import { ConfirmDlgComponent } from '@app/helpers/confirm-dlg/confirm-dlg.component';
import { VendorService } from '@app/services';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-vendor-get',
  templateUrl: './vendor-get.component.html',
  styleUrls: ['./vendor-get.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorGetComponent implements OnInit {

  pager: any;
  vendors: any = [];

  status = 0;
  currentPage = 1;

  searchText: string;

  baseUrl = environment.adminApiUrl;

  constructor(
    private toast: ToastrService,
    private addVendorDlg: MatDialog,
    private cdr: ChangeDetectorRef,
    private vendorService: VendorService) { }

  ngOnInit() {
    this.search(-1, -1);
  }

  // search vendors by title, category
  search(page: number, status: number) {
    if (status !== -1) {
      this.status = status;
    }

    if (page !== -1) {
      this.currentPage = page;
    }

    this.vendorService.vendors(this.searchText, this.currentPage, this.status).subscribe((res: any) => {
      this.pager = res.pager;
      this.vendors = res.pageOfItems;

      this.cdr.markForCheck();
    });
  }

  // go to previous page in pagenation
  prevPage() {
    this.currentPage--;

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    this.search(-1, -1);
  }

  // go to next page in pagenation
  nextPage() {
    this.currentPage++;

    if (this.currentPage > this.pager.totalPages) {
      this.currentPage = this.pager.totalPages;
    }

    this.search(-1, -1);
  }

  // event for search when an vendor press Enter or the search input lose focus
  searchEvent(event) {
    if (event.keyCode === 13) {
      this.search(-1, -1);
    }
  }

  // open a dailog to add an vendor
  openAddVendorDlg() {
    const dialogRef = this.addVendorDlg.open(VendorAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search(-1, -1);
      }
    });
  }

  // open a dailog to edit an vendor
  openEditVendorDlg(index: number) {
    const dialogRef = this.addVendorDlg.open(VendorEditComponent, {
      data: {
        id: this.vendors[index]._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search(-1, -1);
      }
    });
  }

  // open a dailog to delete an vendor
  openConfirmDlg(index: number) {
    const dialogRef = this.addVendorDlg.open(ConfirmDlgComponent, {
      data: {
        id: this.vendors[index]._id,
        name: this.vendors[index].title
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search(-1, -1);
      }
    });
  }

  confirmUrl(url: string) {
    return url.replace(/.png/, '');
  }

  confirmDate(date: any) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
  }

  // change status of an vendor
  changeStatus(vendor: any) {
    this.vendorService.update(vendor).subscribe((res: any) => {
      if (res.success) {
        this.search(-1, -1);

        this.toast.success('The operation was successful.', 'Done');
      } else {
        this.toast.info('Operation failed.', 'Failed');
      }
    });
  }
}
