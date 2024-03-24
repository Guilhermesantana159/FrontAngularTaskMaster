import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/factorys/services/base.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/objects/Usuario/Usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'login-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFormGroup: FormGroup;
  loading: boolean;
  submitLogin: boolean;

  constructor(private formBuilder: FormBuilder,private response: BaseService,private toastr: ToastrService,
    private router: Router) {
    this.loading = false;
    this.submitLogin = false;

    this.loginFormGroup = this.formBuilder.group({
        emailLogin: ['', Validators.required],
        senhaLogin: ['', Validators.required]
    });

  }
    
  Login = (form:FormGroup) =>{
    if(this.loginFormGroup.invalid){
      this.submitLogin = true;
      return;
    }

    this.loading = true;
    this.response.Post("Auth","Login",form.value).subscribe(
      (response: Usuario) =>{        
        if(response.sucesso){
          window.localStorage.setItem('NomeUsuario',response.data.nome);
          window.localStorage.setItem('IdUsuario',response.data.idUsuario);
          window.localStorage.setItem('Token',response.data.sessionKey.acess_token);
          window.localStorage.setItem('Foto', response.data.foto);
          window.localStorage.setItem('Perfil', response.data.perfil.toString());
          this.toastr.success('<small>' + 'Seja bem vindo de volta: <br>' + response.data.nome + '</small>', 'Mensagem:');   
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

  //Campo Senha
  ActiveEyePasswordLogin: boolean = false;

  EyePasswordLogin = (): void => {
    this.ActiveEyePasswordLogin = !this.ActiveEyePasswordLogin;
  };
}
