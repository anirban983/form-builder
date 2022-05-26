import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICustomFormControl } from 'src/app/interfaces/custom.form.control.model';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-configure-form',
  templateUrl: './configure-form.component.html',
  styleUrls: ['./configure-form.component.scss']
})
export class ConfigureFormComponent implements OnInit {

  @ViewChild('modal')
  modal!: ElementRef;
  formDataList: ICustomFormControl[] = []
  builderForm = new FormGroup({})
  form = new FormGroup({})
  questionTypes = ['Textbox', 'Checkbox']
  
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.initializeBuilderForm()
  }

  open() {
    this.modalService.open(this.modal, { 
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    })
  }

  initializeBuilderForm() {
    this.builderForm = new FormGroup({
      questionType: this.formBuilder.control('Textbox', Validators.required),
      question: this.formBuilder.control('', Validators.required)
    })

    this.addCheckboxOptionsField()
  }

  addCheckboxOptionsField() {
    if (this.builderForm.controls['questionType']?.value === 'Checkbox') {
      this.builderForm.addControl('checkboxOptions', this.formBuilder.array([
        this.formBuilder.control(null, Validators.required)
      ]))
    } else {
      if (this.builderForm.controls['checkboxOptions']) {
        this.builderForm.removeControl('checkboxOptions')
      }
    }
  }

  get checkboxOptions() { 
    return this.builderForm.get('checkboxOptions') as FormArray 
  }

  removeCheckboxOption(index: number) {
    const checkboxOptions = this.builderForm.get('checkboxOptions') as FormArray
    checkboxOptions.removeAt(index)
  }

  addCheckboxOption() {
    const checkboxOptions = this.builderForm.get('checkboxOptions') as FormArray
    checkboxOptions.push(this.formBuilder.control(null, Validators.required))
  }

  submit() {
    this.buildForm(this.builderForm.value)
    this.initializeBuilderForm()
    this.modalService.dismissAll()
  }

  buildForm(formData: ICustomFormControl) {
    if (formData['questionType'] === 'Textbox') {
      this.form.addControl(
        this.preProcessControlName(formData['question'], this.formDataList.length), 
        this.formBuilder.control(null, Validators.required)
      )
    } else if (formData['questionType'] === 'Checkbox') {
      formData.checkboxOptions = formData.checkboxOptions.map((value: string) => { return { selected: false, value } })
      this.form.addControl(
        this.preProcessControlName(formData['question'], this.formDataList.length), 
        this.buildCheckboxControls(formData.checkboxOptions)
      )
    }
    this.formDataList.push(formData)
  }

  buildCheckboxControls(options: any[]) {
    const arr = options.map(value => {
      return this.formBuilder.control(value.selected);
    });
    return this.formBuilder.array(arr);
  }

  preProcessControlName(key: string, index: number) {
    return (key.replace(/[^a-zA-Z0-9]/g, "") + '-' +index).toLowerCase()
  }

  reviewAnswers(submittedFormData: any) {
    const result: any[] = []
    let i = 0
    for (const data of this.formDataList) {
      let answer
      const controlName = this.preProcessControlName(data.question, i)
      if (data.questionType === 'Checkbox') {
        const submittedData = submittedFormData[controlName]
        answer = data.checkboxOptions.filter((value, index) => submittedData[index]).map(element => element.value)
      } else {
        answer = submittedFormData[controlName]
      }
      result.push({
        question: data.question,
        questionType: data.questionType,
        answer
      })
      i += 1
    }
    this.formService.reviewAnswers(result)
  }

}
