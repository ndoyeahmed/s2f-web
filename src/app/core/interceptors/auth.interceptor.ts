import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { TokenService } from '../auth/token.service';

const url = environment.url;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService);
  constructor(private readonly authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith('/api')) {
      request = request.clone({
        url: url + request.url,
      });
    }
    const authToken = this.tokenService.getToken();
    request = authToken
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      : request;
    return next.handle(request);
  }
}
