import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { ReviewAnswersComponent } from './components/review-answers/review-answers.component';
import { ReviewAnswersGuard } from './guards/review-answers.guard';

const routes: Routes = [
  { path: '', redirectTo: '/form/builder', pathMatch: 'full' },
  { path: 'form/builder', component: FormBuilderComponent },
  { path: 'form/answers', component: ReviewAnswersComponent, canActivate: [ReviewAnswersGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
