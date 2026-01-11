import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { tokenKey } from './auth-service';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    var cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};
function getJwtToken(): string | null {
  return localStorage.getItem(tokenKey);
}
