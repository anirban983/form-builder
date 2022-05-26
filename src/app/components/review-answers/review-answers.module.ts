import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewAnswersComponent } from './review-answers.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ReviewAnswersComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ReviewAnswersComponent
  ]
})
export class ReviewAnswersModule { }
