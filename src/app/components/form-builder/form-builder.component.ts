import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormService } from 'src/app/services/form.service';

interface CustomFormControl {
  questionType: 'Textbox' | 'Checkbox'
  question: string
  checkboxOptions: any[]
}

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  questionTypes = ['Textbox', 'Checkbox']
  form: FormGroup = new FormGroup({})
  builderForm = new FormGroup({})
  formDataList: CustomFormControl[] = []

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.initializeBuilderForm()
  }

  open(content: any) {
    this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    })
  }

  addCheckboxOption() {
    const checkboxOptions = this.builderForm.get('checkboxOptions') as FormArray
    checkboxOptions.push(this.formBuilder.control(null, Validators.required))
  }

  removeCheckboxOption(index: number) {
    const checkboxOptions = this.builderForm.get('checkboxOptions') as FormArray
    checkboxOptions.removeAt(index)
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
      this.builderForm.addControl('checkboxOptions', new FormArray([
        this.formBuilder.control(null, Validators.required)
      ]))
    } else {
      if (this.builderForm.controls['checkboxOptions']) {
        this.builderForm.removeControl('checkboxOptions')
      }
    }
  }

  submit() {
    this.buildForm(this.builderForm.value)
    this.initializeBuilderForm()
    this.modalService.dismissAll()
  }

  get checkboxOptions() { 
    return this.builderForm.get('checkboxOptions') as FormArray 
  }

  buildForm(formData: CustomFormControl) {
    if (formData['questionType'] === 'Textbox') {
      this.form.addControl(
        this.preProcessControlName(formData['question'], this.formDataList.length), 
        this.formBuilder.control(null, Validators.required)
      )
    } else if (formData['questionType'] === 'Checkbox') {
      formData.checkboxOptions = formData.checkboxOptions.map(value => { return { selected: false, value } })
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

  reviewAnswers() {
    const result: any[] = []
    let i = 0
    for (const data of this.formDataList) {
      let answer
      const controlName = this.preProcessControlName(data.question, i)
      if (data.questionType === 'Checkbox') {
        const submittedData = this.form.value[controlName]
        answer = data.checkboxOptions.filter((value, index) => submittedData[index]).map(element => element.value)
      } else {
        answer = this.form.value[controlName]
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
