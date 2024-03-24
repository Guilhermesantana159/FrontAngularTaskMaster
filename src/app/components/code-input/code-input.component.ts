import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['code-input.component.scss']
})

export class CodeInputComponent implements AfterViewInit{
  form!: HTMLFormElement;
  inputs!: NodeListOf<HTMLInputElement>;
  KEYBOARDS = {
    backspace: 8,
    arrowLeft: 37,
    arrowRight: 39,
  };

  constructor(){
  }

  ngAfterViewInit(): void {
    this.form = document.querySelector('.component') as HTMLFormElement;
    this.inputs = this.form.querySelectorAll('.component-control') as NodeListOf<HTMLInputElement>;

    this.form.addEventListener('input', this.handleInput);
    this.inputs[0].addEventListener('paste', this.handlePaste);

    this.inputs.forEach(input => {
      input.addEventListener('focus', e => {
        setTimeout(() => {
          (e.target as HTMLInputElement).select();
        }, 0);
      });
      
      input.addEventListener('keydown', e => {
        switch((e as KeyboardEvent).keyCode) {
          case this.KEYBOARDS.backspace:
            this.handleBackspace(e);
            break;
          case this.KEYBOARDS.arrowLeft:
            this.handleArrowLeft(e);
            break;
          case this.KEYBOARDS.arrowRight:
            this.handleArrowRight(e);
            break;
          default:  
        }
      });
    });
  }

  handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const nextInput = input.nextElementSibling as HTMLInputElement;
    if (nextInput && input.value) {
      nextInput.focus();
      if (nextInput.value) {
        nextInput.select();
      }
    }
  }

  handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const paste = e.clipboardData?.getData('text') ?? "";
    
    this.inputs.forEach((input, i) => {
      input.value = paste[i];
    });
  }

  handleBackspace(e: KeyboardEvent) { 
    const input = e.target as HTMLInputElement;
    if (input.value) {
      input.value = '';
      return;
    }
    
    const previousInput = input.previousElementSibling as HTMLInputElement;
    previousInput.focus();
  }

  handleArrowLeft(e: KeyboardEvent) {
    const previousInput = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
    if (!previousInput) return;
    previousInput.focus();
  }

  handleArrowRight(e: KeyboardEvent) {
    const nextInput = (e.target as HTMLInputElement).nextElementSibling as HTMLInputElement;
    if (!nextInput) return;
    nextInput.focus();
  }

  ResetCodeInput(){
    this.inputs.forEach(element => {
      element.value = "";
    });
  }

  EnviarCodes(){
    let value = "";

    this.inputs.forEach(element => {
      value = value + element.value;
    });

    return value;
  }

}
