import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import "moment/locale/pt-br";
import * as XLSX from "xlsx";

import { UserAddComponent } from "../user-add/user-add.component";
import { UserEditComponent } from "../user-edit/user-edit.component";
import { ConfirmDlgComponent } from "@app/helpers/confirm-dlg/confirm-dlg.component";
import { UserService, ExcelService } from "@app/services";

import { environment } from "@environments/environment";

@Component({
  selector: "app-user-get",
  templateUrl: "./user-get.component.html",
  styleUrls: ["./user-get.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGetComponent implements OnInit {
  pager: any;
  users: any = [];

  currentPage = 1;
  status = 0;
  searchText: string;
  baseUrl = environment.adminApiUrl;

  constructor(
    private toast: ToastrService,
    private addUserDlg: MatDialog,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.search(-1, -1);
  }

  // search users by name, email, type, phone, address
  search(page: number, status: number) {
    if (status !== -1) {
      this.status = status;
    }

    if (page !== -1) {
      this.currentPage = page;
    }

    this.userService
      .users(this.searchText, this.currentPage, this.status)
      .subscribe((res: any) => {
        this.pager = res.pager;
        this.users = res.pageOfItems;
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

  // event for search when an user press Enter or the search input lose focus
  searchEvent(event) {
    if (event.keyCode === 13) {
      this.search(-1, -1);
    }
  }

  // open a dailog to add an user
  openAddUserDlg() {
    const dialogRef = this.addUserDlg.open(UserAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search(-1, -1);
      }
    });
  }

  // open a dailog to edit an user
  openEditUserDlg(index: number) {
    const dialogRef = this.addUserDlg.open(UserEditComponent, {
      data: {
        id: this.users[index]._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search(-1, -1);
      }
    });
  }

  // open a dailog to delete an user
  openConfirmDlg(index: number) {
    const dialogRef = this.addUserDlg.open(ConfirmDlgComponent, {
      data: {
        id: this.users[index]._id,
        name: this.users[index].name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search(-1, -1);
      }
    });
  }

  // export users to the Excel file
  exportExcel() {
    this.userService.getAllUsers().subscribe((res: any) => {
      this.excelService.exportAsExcelFile(res, "user");
    });
  }

  // import users from the Excel file
  changeExcel(event: any) {
    console.log("changeExcel");
    const file = event.target.files[0];

    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    reader.onload = event => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);

      this.userService.setAllUsers(dataString).subscribe((res: any) => {
        this.search(-1, -1);
        this.cdr.markForCheck();
      });
    };

    reader.readAsBinaryString(file);
  }

  confirmUrl(url: string) {
    return url.replace(/.png/, "");
  }

  confirmDate(date: any) {
    if (date) {
      return moment(date).format("YYYY-MM-DD");
    }
  }

  // change status of an user
  changeStatus(user: any) {
    this.userService.update(user).subscribe((res: any) => {
      if (res.success) {
        this.search(-1, -1);

        this.toast.success("The operation was successful.", "Done");
      } else {
        this.toast.info("Operation failed.", "Failed");
      }
    });
  }
}
