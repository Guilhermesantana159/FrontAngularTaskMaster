import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Usuario } from "src/app/objects/Usuario/Usuario";
import { BaseService } from "src/factorys/services/base.service";
import { ValidateSenha } from "src/factorys/validators/validators-form";

@Component({
  selector: 'register-root',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})

export class RegisterComponent {
  UserRegisterFormGroup: FormGroup;
  loading: boolean;
  submitRegister: boolean;

  constructor(private formBuilder: FormBuilder,private response: BaseService,private toastr: ToastrService,
    private router: Router) {
    this.loading = false;
    this.submitRegister = false;

    this.UserRegisterFormGroup = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      nome: ['', Validators.required],
      CPF: ['', [Validators.required,Validators.minLength(11)]],
      genero: ['0'],
      senha: ['', [Validators.required,ValidateSenha]]
    });
  }

  RegisterUsuario = (form:FormGroup) =>{
    if(this.UserRegisterFormGroup.invalid){
      this.submitRegister = true;
      return;
    }

    //Formatação tipo da variável enum back-end
    form.get('genero')?.setValue(parseInt(form.get('genero')?.value));

    this.loading = true;
    this.response.Post("Usuario","CadastroInicial",form.value).subscribe(
      (response: Usuario) =>{        
        if(response.sucesso){
          window.localStorage.setItem('NomeUsuario',response.data.nome);
          window.localStorage.setItem('IdUsuario',response.data.idUsuario.toString());
          window.localStorage.setItem('Token',response.data.sessionKey.acess_token);
          window.localStorage.setItem('Foto', response.data.foto);
          window.localStorage.setItem('Perfil', response.data.perfil.toString());
          this.toastr.success('<small> Seja bem vindo <br>' + response.data.nome + '</small>', 'Mensagem:');   
          this.router.navigate(['/', 'main-dashboard'])        
        }else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem');
        }
        this.loading = false;
      }
    );

    //Re atribuição caso error
    form.get('genero')?.setValue((form.get('genero')?.value.toString()));
  }

  //Campo Senha
  ActiveEyePasswordRegister: boolean = false;

  EyePasswordRegister = (): void => {
    this.ActiveEyePasswordRegister = !this.ActiveEyePasswordRegister;
  };
}
