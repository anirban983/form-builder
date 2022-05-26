export type questionType = 'Textbox' | 'Checkbox'

export interface ICustomFormControl {
    questionType: questionType
    question: string
    checkboxOptions: any[]
}