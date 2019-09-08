import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '@app/services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
      const currentUser = this.authenticationService.currentUserValue;

      if (request.url.indexOf('/upload') === -1) {
        request = request.clone({
          setHeaders: {
            accept: 'application/json',
            'content-type': 'application/json'
          }
        });
      }

      if (currentUser && currentUser.token) {
          request = request.clone({
            setHeaders: {
                authorization: `Bearer ${currentUser.token}`,
              }
          });
      }

      return next.handle(request);
    }
}
