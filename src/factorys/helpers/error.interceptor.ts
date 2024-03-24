import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private toastr: ToastrService,private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                window.localStorage.clear();
                this.toastr.warning('<small>Sua sessão expirou!</small>', 'Mensagem:');
                this.router.navigateByUrl('/login');
            }

            if (err.status === 500) {
                this.toastr.error('<small>Erro interno no servidor contate o administrador deste website!</small>', 'Mensagem:');
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
