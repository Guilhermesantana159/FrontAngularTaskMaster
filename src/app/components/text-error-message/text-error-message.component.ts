import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-error-message',
  templateUrl: './text-error-message.component.html',
  styleUrls: ['./text-error-message.css']
})
export class TextErrorMessageComponent{
  @Input() text= '';
}
