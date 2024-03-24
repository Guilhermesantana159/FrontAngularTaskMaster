import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/factorys/services/base.service';
import { Endereco } from 'src/app/objects/Endereco/Endereco';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ValidateDataAniversario, ValidateSenha } from 'src/factorys/validators/validators-form';
import { BaseOptions } from 'flatpickr/dist/types/options';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { Skill } from 'src/app/objects/Usuario/Skill';
import { UsuarioResponse } from 'src/app/objects/Usuario/UsuarioResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'usuario-crud-root',
  templateUrl: './usuario-crud.component.html',
  styleUrls: ['../usuario.component.css']
})

export class UsuarioCrudComponent{
  //Variaveis funcionais comportamento da tela tela
  loading = false;
  UserRegisterFormGroup: FormGroup;
  submitRegister = false;
  indexTab: number = 0;
  IsNew = true;  
  @ViewChild("customNav") nav: any;

  //Aba configurações
  IsAdmin: string = window.localStorage.getItem('Perfil') ?? "false";

  //Aba endereço
  disabledForApiCep: boolean = true;

  //Aba Principal
  options!: Array<BaseOptions>;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;
  porcentagem!: number;
  lSkill: Skill[] = [];

  constructor(private formBuilder: FormBuilder,private response: BaseService,private router: Router,private route: ActivatedRoute,private toastr: ToastrService) {
    this.loading = true;

    //Formulario builder
    this.UserRegisterFormGroup = this.formBuilder.group({
      idUsuario: [undefined],
      perfilAdministrador: [false],
      cep: [undefined, [Validators.required,Validators.minLength(8)]],
      pais: ['Brasil', [Validators.required]],
      estado: [undefined, [Validators.required]],
      cidade: [undefined, [Validators.required]],
      bairro: [undefined, [Validators.required]],
      foto: [null],
      rua: [undefined, [Validators.required]],
      numero: [undefined, [Validators.required]],
      nome: [undefined, [Validators.required]],
      email: [undefined, [Validators.required,Validators.email]],
      nomeMae: [undefined, [Validators.required]],
      nomePai: [undefined],      
      cpf: [undefined, [Validators.required,Validators.minLength(11)]],
      observacao: [undefined],     
      telefone: [undefined, [Validators.minLength(11)]],
      genero: ['0', [Validators.required]],
      dataNascimento: [undefined, [Validators.required,ValidateDataAniversario]],
      lSkills: [[]],
      senha: ['', [Validators.required,ValidateSenha]]
    });

    this.route.params.subscribe(params => {
      //Load Edit
      if(params['id'] != undefined){
        this.loading = true;
        this.response.Get("Usuario","ConsultarViaId/" + params['id']).subscribe(
        (response: UsuarioResponse) =>{        
          if(response.sucesso){
            this.IsNew = false;
            this.UserRegisterFormGroup.setValue(response.data);
            this.UserRegisterFormGroup.get('pais')?.setValue('Brasil');
            this.UserRegisterFormGroup.get('dataNascimento')?.setValue(new Date(response.data.dataNascimento));

            //Atribuições
            response.data.lSkills.forEach(element => {
              this.lSkill.push(element);

            });

            this.porcentagem = this.calculatePercentageFilled();

            //Deixa de ser obrigatório na edição
            this.UserRegisterFormGroup.get('senha')?.clearValidators();
            this.UserRegisterFormGroup.get('senha')?.addValidators([ValidateSenha]);

          }else{
            this.toastr.error(response.mensagem, 'Mensagem:');
          }
          this.loading = false;
      });
    }});

    this.loading = false;
  }

  //Funções aba principal
  Add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.lSkill.push({descricao:value});
    }

    event.chipInput!.clear();
    this.UserRegisterFormGroup.get('lSkills')?.setValue(this.lSkill);
  }

  Remove(skill: Skill): void {
    const index = this.lSkill.indexOf(skill);

    if (index >= 0) {
      this.lSkill.splice(index, 1);
    }

    this.UserRegisterFormGroup.get('lSkills')?.setValue(this.lSkill);
  }
 
  //Aba configurações endereço
  FormatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + '%';
    }

    return value;
  }

  //Aba Endereco funções
  PesquisarEndereco = () =>{
    let cepValue = this.UserRegisterFormGroup.get('cep'); 
    this.loading = true;

    if(cepValue?.invalid){
      this.loading = false;
      this.toastr.error('<small>Preencha o campo cep corretamente!</small>', 'Mensagem:');
      return;
    }

    this.response.Get("Utils","ConsultarEnderecoCep/" + cepValue?.value).subscribe(
      (response: Endereco) =>{        
        if(response.sucesso){
          this.UserRegisterFormGroup.get('estado')?.setValue(response.data.estado);
          this.UserRegisterFormGroup.get('cidade')?.setValue(response.data.cidade);
          this.UserRegisterFormGroup.get('rua')?.setValue(response.data.rua);
          this.UserRegisterFormGroup.get('bairro')?.setValue(response.data.bairro);
          this.disabledForApiCep = response.data.statusApi;
        }
        else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }
        this.loading = false;
      }
    );
  };

  //Operacional da página
  Salvar = (form:FormGroup) =>{
    this.loading = true;
    this.submitRegister = true;

    if(this.UserRegisterFormGroup.invalid){
      this.loading = false;
      this.toastr.error('<small>Preencha os campos corretamente no formulário!</small>', 'Mensagem:');
      return;
    }

    //Formatação tipo da variável enum back-end
    form.get('genero')?.setValue(parseInt(form.get('genero')?.value));

    if(this.IsNew){
      this.response.Post("Usuario","Cadastrar",form.value).subscribe(
        (response: RetornoPadrao) =>{        
          if(response.sucesso){
            this.toastr.success(response.mensagem, 'Mensagem:');
            this.router.navigateByUrl('/main-dashboard/entities/usuario')
          }else{
            this.toastr.error(response.mensagem, 'Mensagem:');
          }
          this.loading = false;
        }
      );
    }else{
      this.response.Post("Usuario","Editar",form.value).subscribe(
        (response: RetornoPadrao) =>{        
          if(response.sucesso){
            this.toastr.success(response.mensagem, 'Mensagem:');
            this.router.navigateByUrl('/main-dashboard/entities/usuario')
          }else{
            this.toastr.error(response.mensagem, 'Mensagem:');
          }
          this.loading = false;
        }
      );
    }

    //Re atribuição caso error
    form.get('genero')?.setValue((form.get('genero')?.value.toString()));
  };

  OpenFileUpload = () => {
    document.getElementById("customFile")?.click();
  };

  ActiveEyePassword: boolean = false;

  EyePassword = (): void => {
    this.ActiveEyePassword = !this.ActiveEyePassword;
  };

  ChangeFoto = (event:any) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file); 

    reader.onloadend = () => {
      let base64data: any = reader.result;
      this.UserRegisterFormGroup.get('foto')?.setValue(base64data);
    }
  };

  LimparCampoData(){
    this.UserRegisterFormGroup.get('dataNascimento')?.setValue(undefined);
  }

   //Campo Senha
   ActiveEyePasswordLogin: boolean = false;

   EyePasswordLogin = (): void => {
     this.ActiveEyePasswordLogin = !this.ActiveEyePasswordLogin;
   };

  calculatePercentageFilled(): number {
    debugger
    const totalFields = Object.keys(this.UserRegisterFormGroup.controls).length;
    const filledFields = Object.values(this.UserRegisterFormGroup.controls).filter(control => control.value !== null && control.value !== undefined && control.value !== '').length;

    const percentageFilled = (filledFields / totalFields) * 100;
    return Math.round(percentageFilled);
  }

  //Interação das abas
  ControleAbas(event: number){
    this.indexTab = event;
  }

  ButtonEventAba(acc: number){
    this.indexTab += acc;
    this.nav.select(this.indexTab);
  }
};


