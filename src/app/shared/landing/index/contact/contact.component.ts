import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { BaseService } from 'src/factorys/services/base.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

/**
 * Contact Component
 */
export class ContactComponent implements OnInit {
  contatoFormGroup: FormGroup;
  submitContato: boolean;

  constructor(private formBuilder: FormBuilder,private response: BaseService,private toastr: ToastrService) {
    this.submitContato = false;

    this.contatoFormGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required,Validators.email],
      mensagem: ['', Validators.required]
    });

  }
  
  ngOnInit(): void {
  }

  Send(form: FormGroup){
    if(form.invalid){
      this.toastr.error('<small>Preencha os campos corretamente!</small>', 'Mensagem:');
      return;
    }

    this.submitContato = true;
    this.response.Post("Utils","CadastrarContatoMensagem",form.value).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success('<small>' + response.mensagem + '</small>', 'Mensagem:');   
          this.contatoFormGroup.reset();
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.submitContato = false;
      }
    );
  }
}
