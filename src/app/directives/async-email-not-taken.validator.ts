import { AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import 'rxjs/add/operator/map';

export class ValidateEmailNotTaken {
  static createValidator(userService: UserService) {
    return (control: AbstractControl) => {
      return userService.checkEmailNotTaken(control.value).map((res: any) => {
        return res.emailNotTaken ? null : {emailTaken: true};
      });
    };
  }
}
