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

  /**
   * Method to open modal
   */
  open() {
    this.modalService.open(this.modal, { 
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    })
  }

  /**
   * Method to initialize builder form
   */
  initializeBuilderForm() {
    this.builderForm = new FormGroup({
      questionType: this.formBuilder.control('Textbox', Validators.required),
      question: this.formBuilder.control('', Validators.required)
    })

    this.addCheckboxOptionsField()
  }

  /**
   * Method to add checkbox options field to builder form if checkbox question type is selected
   */
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

  /**
   * Method to get checkbox options from builder form as a FormArray
   */
  get checkboxOptions() { 
    return this.builderForm.get('checkboxOptions') as FormArray 
  }

  /**
   * Method to remove checkbox answer option from form array by index
   * @param index 
   */
  removeCheckboxOption(index: number) {
    const checkboxOptions = this.builderForm.get('checkboxOptions') as FormArray
    checkboxOptions.removeAt(index)
  }

  /**
   * Method to add checkbox option answer to form array in builder form
   */
  addCheckboxOption() {
    const checkboxOptions = this.builderForm.get('checkboxOptions') as FormArray
    checkboxOptions.push(this.formBuilder.control(null, Validators.required))
  }

  /**
   * Method to submit builder form data
   */
  submit() {
    this.buildForm(this.builderForm.value)
    this.initializeBuilderForm()
    this.modalService.dismissAll()
  }

  /**
   * Method to build form from builder form
   * @param formData 
   */
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

  /**
   * Method to build checkbox controls from the submitted data in builder form
   * @param options 
   * @returns 
   */
  buildCheckboxControls(options: any[]) {
    const arr = options.map(value => {
      return this.formBuilder.control(value.selected);
    });
    return this.formBuilder.array(arr);
  }

  /**
   * Method to create an unique control name for form
   * @param key 
   * @param index 
   * @returns 
   */
  preProcessControlName(key: string, index: number) {
    return (key.replace(/[^a-zA-Z0-9]/g, "") + '-' +index).toLowerCase()
  }

  /**
   * Method to map data between form data list and form submitted to create results array and navigate to answers page
   * @param submittedFormData 
   */
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
