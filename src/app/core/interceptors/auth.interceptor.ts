import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

const url = environment.url;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith('/api')) {
      request = request.clone({
        url: url + request.url,
      });
    }
    if (this.authenticationService.token()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.token()}`,
        },
      });
    }
    return next.handle(request);
  }
}
