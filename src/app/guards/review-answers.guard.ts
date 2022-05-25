import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FormService } from '../services/form.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewAnswersGuard implements CanActivate {
  constructor(
    private formService: FormService, 
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.formService.submittedData) return true
    else {
      this.router.navigate([''])
      return false
    }
  }
  
}
