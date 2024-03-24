import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CodeInputComponent } from "src/app/components/code-input/code-input.component";
import { RetornoPadrao } from "src/app/objects/RetornoPadrao";
import { Usuario } from "src/app/objects/Usuario/Usuario";
import { BaseService } from "src/factorys/services/base.service";
import { ValidateSenha } from "src/factorys/validators/validators-form";


@Component({
  selector: 'recover-password-root',
  templateUrl: './recoverPassword.component.html',
  styleUrls: ['./recoverPassword.component.css']
})

export class RecoverPasswordComponent {
  @ViewChild(CodeInputComponent)
  child!: CodeInputComponent;

  recoverFormGroup: FormGroup;
  changePasswordFormGroup: FormGroup;
  loading: boolean = false;
  submitrecover: boolean = false;
  submitChange: boolean = false;
  equalsInput: boolean = false;
  formActive: number = 1;
  
  constructor(private formBuilder: FormBuilder,private response: BaseService,private router: Router,private toastr: ToastrService) {
      this.recoverFormGroup = this.formBuilder.group({
        emailrecover: ['', [Validators.required,Validators.email]],
        cpfrecover: ['', [Validators.required,Validators.minLength(11)]]
      });

      this.changePasswordFormGroup = this.formBuilder.group({
        senha: ['', [Validators.required,ValidateSenha]],
        senhaRepeat: ['', [Validators.required]]
      });
  }

  ChangeInput(){
    if(this.changePasswordFormGroup.get('senha')?.value != this.changePasswordFormGroup.get('senhaRepeat')?.value){
      this.equalsInput = false;
    }else{
      this.equalsInput = true;
    }
  }

  RecuperarSenha(form:FormGroup){
    if(this.recoverFormGroup.invalid){
      this.submitrecover = true;
      return;
    }

    this.loading = true;
    this.response.Post("Auth","RecuperarSenha",form.value).subscribe(
      (response: any) =>{        
        if(response.sucesso){
          window.localStorage.setItem('IdUsuario',response.data.toString());
          this.toastr.warning('<small>' + response.mensagem + '</small>', 'Mensagem:');
          this.formActive = 2;
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      }
    );
  }

  AlterarSenha(form:FormGroup){
    this.submitChange = true;

    if(this.equalsInput == false){
      return;
    }

    if(this.changePasswordFormGroup.invalid){
      return;
    }

    this.loading = true;
    this.response.Post("Auth","AlterarSenha",{Senha: this.changePasswordFormGroup.get('senha')?.value,IdUsuario: window.localStorage.getItem('IdUsuario')}).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          
          this.toastr.success('<small>' + response.mensagem + '</small>', 'Mensagem:');
          this.toastr.success('<small>' + 'Seja bem vindo de volta: <br>' + window.localStorage.getItem('NomeUsuario') + '</small>', 'Mensagem:');   
          this.router.navigate(['/', 'main-dashboard'])
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      }
    );
  }

  AutenticarCodigo(){
    let codigo = this.child.EnviarCodes();
    
    if(codigo.length < 6){
      this.toastr.error('<small>Preencha o código corretamente!</small>', 'Mensagem:');
      return;
    }

    this.loading = true;
    this.response.Post("Auth","ValidarCodigo",{Codigo: codigo,IdUsuario: window.localStorage.getItem('IdUsuario')}).subscribe(
      (response: Usuario) =>{        
        if(response.sucesso){
          window.localStorage.setItem('NomeUsuario',response.data.nome);
          window.localStorage.setItem('Token',response.data.sessionKey.acess_token);
          window.localStorage.setItem('Foto', response.data.foto);
          this.formActive = 3;
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      }
    );
  }

  //Campo Senha
  ActiveEyePassword: boolean = false;

  EyePassword = (): void => {
    this.ActiveEyePassword = !this.ActiveEyePassword;
  };

}
