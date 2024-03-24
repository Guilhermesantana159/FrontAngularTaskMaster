import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BaseService } from "../services/base.service";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  token!: string | null;

  constructor(private response: BaseService,private router: Router,private toastr: ToastrService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = window.localStorage.getItem('Token');

    req = req.clone({
        setHeaders: { Authorization: `Bearer ${this.token}`}
    });

    return next.handle(req).pipe(tap({
      error: err => { 
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401 || err.status == 403) 
          {
            this.toastr.warning('<small>Sua sessão expirou!</small>');
            window.localStorage.clear();
            this.response.CloseConnection();
            this.router.navigateByUrl('/login');
          }else if(err.status == 500){
            this.router.navigateByUrl('/manutencao/error/500');
            throwError(() => new Error(err.message))          
          }
          else
            throwError(() => new Error(err.message))          
        }
      },
    }));
  };
};

