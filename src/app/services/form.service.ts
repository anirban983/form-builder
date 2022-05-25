import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  submittedData: any

  constructor(private router: Router) { }

  reviewAnswers(data: any) {
    this.submittedData = data
    this.router.navigate(['form', 'answers'])
  }
}
