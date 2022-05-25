import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-review-answers',
  templateUrl: './review-answers.component.html',
  styleUrls: ['./review-answers.component.scss']
})
export class ReviewAnswersComponent implements OnInit {
  result: any

  constructor(
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.result = this.formService.submittedData
    console.log(this.result)
  }

}
