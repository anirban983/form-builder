import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigureFormComponent } from './components/configure-form/configure-form.component';
import { ReviewAnswersComponent } from './components/review-answers/review-answers.component';
import { ReviewAnswersGuard } from './guards/review-answers.guard';

const routes: Routes = [
  { path: '', redirectTo: '/form/builder', pathMatch: 'full' },
  { path: 'form/builder', component: ConfigureFormComponent },
  { path: 'form/answers', component: ReviewAnswersComponent, canActivate: [ReviewAnswersGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
