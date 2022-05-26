import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICustomFormControl } from 'src/app/interfaces/custom.form.control.model';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.scss']
})
export class FormViewerComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({})
  @Input() formDataList: ICustomFormControl[] = []
  @Output() openConfigureFormModalEvent = new EventEmitter() 
  @Output() reviewAnswersEvent = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  preProcessControlName(key: string, index: number) {
    return (key.replace(/[^a-zA-Z0-9]/g, "") + '-' +index).toLowerCase()
  }

  open() {
    this.openConfigureFormModalEvent.emit()
  }

  reviewAnswers() {
    this.reviewAnswersEvent.emit(this.form.value)
  }

}
