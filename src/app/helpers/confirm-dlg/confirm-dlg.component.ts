import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '@app/services';

@Component({
  selector: 'app-confirm-dlg',
  templateUrl: './confirm-dlg.component.html',
  styleUrls: ['./confirm-dlg.component.scss']
})
export class ConfirmDlgComponent implements OnInit {

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmDlgComponent>) { }

  ngOnInit() {
  }

  delete() {
    this.userService.deleteById(this.data.id).subscribe((res: any) => {
      this.dialogRef.close(res.success);
    });
  }

}
