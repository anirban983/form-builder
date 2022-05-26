import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigureFormComponent } from './configure-form.component';
import { FormViewerModule } from '../form-viewer/form-viewer.module';



@NgModule({
  declarations: [
    ConfigureFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormViewerModule
  ], 
  exports: [
    ConfigureFormComponent
  ]
})
export class ConfigureFormModule { }
