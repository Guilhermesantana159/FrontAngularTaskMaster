import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { Lightbox } from 'ngx-lightbox';
import { BaseService } from 'src/factorys/services/base.service';
import { ToastrService } from 'ngx-toastr';
import {ChatUsuarioBloqueioResponse, DataChatUsuarioBloqueioResponse } from 'src/app/objects/Chat/ChatUsuarioBloqueioResponse';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { ConsultaModalParams } from 'src/app/objects/Consulta-Padrao/ConsultaModalParams';
import { DefaultService } from 'src/factorys/services/default.service';
import { ChatContatos } from 'src/app/objects/Chat/ChatContatos';
import { ContatoResponse, DataContatoResponse } from 'src/app/objects/Chat/ContatoResponse';
import { EStatusContato } from 'src/app/enums/EStatusContato';
import { MessageChat } from 'src/app/objects/Chat/MessageChat';
import { MensagemChatResponse } from 'src/app/objects/Chat/MensagemChatResponse';
import { Observable } from 'rxjs';
import { ChatContatoResponse } from 'src/app/objects/Chat/ChatUsuarioBloqueio';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})


export class ChatComponent implements OnInit {
  @ViewChild('scrollRef') scrollRef:any;
  emoji = '';

  //Operação
  loadingSidebar: boolean = false;
  loadingInfoContato: boolean = false;
  idUsuario:number = parseInt(window.localStorage.getItem('IdUsuario') ?? '0');
  fotoUser:string = window.localStorage.getItem('Foto') ?? "assets/images/users/user-dummy-img.jpg";
  listUserOnline: Array<{
    idUsuario: number,
    idUsuarioSignalr: number
  }> = [];

  //Contatos
  paramsConsultaUsuario: ConsultaModalParams;
  ContatoFormGroup: FormGroup;
  lContatos: ChatContatos[] = [];
  bloqueou: boolean = false;
  foiBloqueado: boolean = false;

  //Grupo
  isNewGrupo:boolean = true;
  GrupoFormGroup: FormGroup;
  submitRegisterGrupo: Boolean = false;
  lContatosGrupo: DataContatoResponse[] = [];

  //Chat
  userChat: DataContatoResponse | undefined;
  loadingMsgSend: boolean = false;
  formData!: UntypedFormGroup;
  chatMessagesData: MessageChat[] = [];
  lMensagensDireta: DataContatoResponse[] = [];
  loadingMsg: boolean = false;
  isreplyMessage = false;
  submitted = false;
  abaActive = 0;
  lUsuarioBloqueado!: DataChatUsuarioBloqueioResponse;

  constructor(public formBuilder: UntypedFormBuilder, private lightbox: Lightbox, 
    private offcanvasService: NgbOffcanvas, private datePipe: DatePipe,private response: 
    BaseService,private toastr: ToastrService,private defaultService: DefaultService,private modalService: NgbModal) { 

    this.paramsConsultaUsuario = {
      Label: '',
      Title: 'Adicionar contato',
      Disabled: false,
      Class: 'col-sm-12 col-xs-8 col-md-8 col-lg-8',
      Required: false,
      GridOptions: defaultService.Modal.ConsultaPadraoUsuario,
      SelectedText: '',
      SelectedValue: '',
      OnlyButton: true
    };

    //Adicionar contato
    this.ContatoFormGroup = this.formBuilder.group({
      responsavel: [undefined, [Validators.required]],
      idResponsavel: [undefined, [Validators.required]]
    });

    this.ContatoFormGroup.get('idResponsavel')?.valueChanges.subscribe(value => {
      this.adicionarContato(value);
    });

    this.GrupoFormGroup = this.formBuilder.group({
      idGrupo: [undefined],
      titulo: [undefined, [Validators.required]],
      contatos: [undefined, [Validators.required]]
    });
  }

  startConnection(){
    this.response.connection.on("newMessage",(message: MessageChat) => {
      message.align = 'left'
      this.chatMessagesData.push(message);
    });

    this.response.connection.on("connectOnline",(message: any) => {
      this.listUserOnline = message;

      //Atualizar mensagem direta
      this.lMensagensDireta.forEach(element => {
        if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === element?.idUsuarioContato) == -1){
          element.online = false;
        }
        else{
          element.online = true;
        }
      });

      //Atualizar contato
      this.lContatos.forEach(elementContact => {
        elementContact.contacts.forEach(element => {
          if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === element?.idUsuarioContato) == -1){
            element.online = false;
          }
          else{
            element.online = true;
          }
        });
      });

      //Atualizar Usuario
      if(this.userChat != undefined){
        if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === this.userChat?.idUsuarioContato) == -1){
          this.userChat.online = false;
        }
        else{
          this.userChat.online = true;
        }
      }
    });

    this.response.connection.on("onDisconnectedAsync",(message: any) => {
      this.listUserOnline = message;

      //Atualizar mensagem direta
      this.lMensagensDireta.forEach(element => {
        if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === element?.idUsuarioContato) == -1){
          element.online = false;
        }
        else{
          element.online = true;
        }
      });

      //Atualizar contato
      this.lContatos.forEach(elementContact => {
        elementContact.contacts.forEach(element => {
          if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === element?.idUsuarioContato) == -1){
            element.online = false;
          }
          else{
            element.online = true;
          }
        });
      });

      //Atualizar Usuario
      if(this.userChat != undefined){
        if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === this.userChat?.idUsuarioContato) == -1){
          this.userChat.online = false;
        }
        else{
          this.userChat.online = true;
        }
      }
    });
  }

  sendMessage(message: MessageChat,idUserDestino: number){
    this.response.connection.send("newMessage",message,idUserDestino).then(() => {
    })
  }

  ngOnInit(): void {
    this.loadingSidebar = true;

    //Iniciar tela
    this.consultarContatos()
    this.consultarMensagensDireta()
    this.consultarBloqueados();

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    setTimeout(() => {
      this.startConnection();
      this.getListConnected();
    },2000)

    //Iniciar mensagens
    this.onListScroll();
  }

  consultarBloqueados(){
    this.response.Get("Chat","ConsultarBloqueioChat/" + this.idUsuario).subscribe(
      (response: ChatUsuarioBloqueioResponse) =>{        
        if(response.sucesso){
          this.lUsuarioBloqueado = response.data;
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
      }
    );
  }

  consultarContatos(){
    this.response.Get("Chat","ConsultarContatoPorIdPessoa/" + this.idUsuario).subscribe(
      (response: ChatContatoResponse) =>{        
        if(response.sucesso){
          let groupedContacts = response.data.lContatos.reduce((groups: { [title: string]: DataContatoResponse[] }, contato) => {
            let firstLetter = contato.nome?.charAt(0).toUpperCase();
            if (firstLetter) {
              groups[firstLetter] = groups[firstLetter] || [];
              groups[firstLetter].push({
                nome: contato.nome,
                foto: contato.foto,
                statusContato: contato.statusContato,
                idUsuarioContato: contato.idUsuarioContato,
                idContatoChat: contato.idContatoChat,
                online: true,
                telefone: contato.telefone,
                sobre: contato.sobre,
                email: contato.email,
                dataNascimento: contato.dataNascimento,
                mensagemNaoLida: 0
              });
            }
            return groups;
          }, {});

          for (const title in groupedContacts) {
            if (groupedContacts.hasOwnProperty(title)) {
              this.lContatos.push({
                title: title,
                contacts: groupedContacts[title],
              });
            }
          }

          response.data.lContatos.forEach(element => {
            this.lContatosGrupo.push(element)
          });
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }

        this.loadingSidebar = false;
      }
    );
  };

  adicionarContato(idUsuarioContato:number){
    let validContato = true;
    this.lContatos.forEach(element => {
      if(this.ContatoFormGroup.get('responsavel')?.value.substring(0,1).toUpperCase() == element.title){
        let index = element.contacts.findIndex(objeto => objeto.idUsuarioContato === idUsuarioContato);

        if (index !== -1) {
          validContato = false;
          return
        }
      }
    });

    if(!validContato){
      this.toastr.warning('<small>Usuário já adicionado como contato!</small>', 'Mensagem:');
      return
    }

    if(idUsuarioContato == this.idUsuario){
      return;
    }

    this.loadingSidebar = true;
    this.response.Post("Chat","CadastrarContato/",{
      IdUsuarioCadastro: this.idUsuario,
      IdUsuarioContato: idUsuarioContato
    }).subscribe(
      (response: ContatoResponse) =>{        
        if(response.sucesso){
          if(this.lContatos.length == 0){
            this.lContatos.push({
              title: response.data.nome.substring(0,1).toUpperCase(),
              contacts: [response.data]
            });
          }else{
            let newTitle = true;
            this.lContatos.forEach(element => {
              if(element.title.toUpperCase() == (response.data.nome.substring(0,1)).toUpperCase()){
                element.contacts.push(response.data);
                newTitle = false;
              }
            });

            if(newTitle){
              this.lContatos.push({
                title: response.data.nome.substring(0,1).toUpperCase(),
                contacts: [response.data]
              });
            }
          }
          
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }

        this.loadingSidebar = false;
      }
    );
  }

  excluirContato(contato:DataContatoResponse,list: ChatContatos){
    let index = list.contacts.findIndex(objeto => objeto.idContatoChat === contato.idContatoChat);

    if (index !== -1) {
      list.contacts.splice(index, 1);

      if(list.contacts.length == 0){
        index = this.lContatos.findIndex(objeto => objeto.title === list.title);

        if (index !== -1) {
          this.lContatos.splice(index, 1);
        }
      }
    }

    this.response.Post("Chat","DeletarContato/" + contato.idContatoChat,{}).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
      }
    );
  }

  alterarStatusContato(contato:DataContatoResponse,status: EStatusContato){
    if(contato.statusContato == EStatusContato.Disponivel){
      contato.statusContato = status;
    }
    else if(contato.statusContato == status){
      contato.statusContato = EStatusContato.Disponivel;
      status = EStatusContato.Disponivel
    }

    if(status == EStatusContato.Bloqueado){
      this.lUsuarioBloqueado.listChatBloqueio.push({
        idBloqueado: contato.idUsuarioContato,
        idBloqueador: this.idUsuario
      })
    }

    if(status == EStatusContato.Disponivel){
      for (let index = 0; index < this.lUsuarioBloqueado.listChatBloqueio.length; index++) {
        if(this.lUsuarioBloqueado.listChatBloqueio[index].idBloqueado == contato.idUsuarioContato){
          this.lUsuarioBloqueado.listChatBloqueio.splice(index,1)
        }
      }
    }

    this.response.Post("Chat","AlterarStatusContato/",{
      IdContatoChat: contato.idContatoChat,
      NewStatus: status
    }).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        else
        {
          if(status != EStatusContato.Disponivel){
            this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
          }
        }
      }
    );
  };

  carregarUsuario(data: DataContatoResponse) {
    data.mensagemNaoLida = 0;
    this.loadingMsg = true;

    this.response.Get("Chat","ConsultarMensagens/" + localStorage.getItem('IdUsuario') + '/' + data.idUsuarioContato).subscribe(
    (response: MensagemChatResponse) =>{      
      if(response.sucesso){ 
        this.chatMessagesData = [];
        
        response.data.mensagemChat.forEach(element => {
            this.chatMessagesData.push(element);
        });      
      } 
      else{
        this.toastr.error(response.mensagem, 'Mensagem:');
      };

      this.loadingMsg = false;
    });

    //Verificar se esta bloqueado ou se bloqueou
    this.bloqueou = false;
    this.foiBloqueado = false;

    this.lUsuarioBloqueado.listChatBloqueio.forEach(element => {
      if(element.idBloqueador == this.idUsuario && element.idBloqueado == data.idUsuarioContato){
        this.bloqueou = true;

        if(this.userChat != undefined){
          data.foto = undefined;
          data.online = false;
        }
      }

      if(element.idBloqueado == this.idUsuario && element.idBloqueador == data.idUsuarioContato){
        this.foiBloqueado = true;

        if(this.userChat != undefined){
          data.foto = undefined;
          data.online = false;
        }
      }
    });

    this.userChat = data;

    if(this.bloqueou){
      
    }
    else if(this.foiBloqueado){
      
    }

  }

  salvarMensagem() {
    const message = this.formData.get('message')!.value;  
    var chatReplyUser = (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .conversation-name") as HTMLAreaElement).innerHTML;
    var chatReplyMessage = (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .mb-0")as HTMLAreaElement).innerText;


    if(this.lMensagensDireta.findIndex(x => x.idContatoChat == this.userChat?.idContatoChat) == -1){
      if(this.userChat != undefined){
        this.lMensagensDireta.unshift(this.userChat);
      }
    };

    let indexUserMessage = this.lMensagensDireta.findIndex(x => x.idContatoChat == this.userChat?.idContatoChat);
    if(indexUserMessage != -1){
      let user = this.lMensagensDireta[indexUserMessage];
      this.lMensagensDireta.splice(indexUserMessage,1);

      this.lMensagensDireta.unshift(user);
    };

    this.loadingMsgSend = true;
    this.response.Post("Chat","SalvarMensagem/",{
      IdUsuarioMandante: localStorage.getItem('IdUsuario'),
      IdUsuarioRecebe: this.userChat?.idUsuarioContato,
      IdContatoRecebe: this.userChat?.idContatoChat,
      Message: message,
      ReplayName: this.isreplyMessage ? chatReplyUser: undefined,
      ReplayMessage: this.isreplyMessage ? chatReplyMessage : undefined,
    }).subscribe(
    (response: any) =>{      
      if(response.sucesso){  
        var dateTime = this.datePipe.transform(new Date(),'dd/MM/yyyy HH:mm:ss');
     
        let obj =  {
          align: 'right',
          replayName: chatReplyUser,
          replayMessage: chatReplyMessage,
          message: message,
          dataCadastro: dateTime,
          idMensagemChat: response.data.IdMensagemChat,
          statusMessage: 0
        }
        if (this.isreplyMessage == true) {
          obj.replayName = chatReplyUser;
          obj.replayMessage = chatReplyMessage;
        } 
        
        this.chatMessagesData.push(obj);
        
        this.sendMessage(obj,this.userChat?.idUsuarioContato ?? 0)
      } 
      else{
        this.toastr.error(response.mensagem, 'Mensagem:');
      };

      //Reset
      this.formData.get('message')?.setValue(undefined);
      this.onListScroll();
      this.loadingMsgSend = false;  

      document.querySelector('.replyCard')?.classList.remove('show');
      this.emoji = '';
      
      this.submitted = true;
      this.isreplyMessage = false;
    });
  }

  MessageSearch(){
    var input:any, filter:any, ul:any, li:any, a:any | undefined, i:any, txtValue:any;
    input = document.getElementById("searchMessage") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.getElementById("users-conversation");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("p")[0];
      txtValue = a?.innerText;
      if (txtValue?.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
    } else {
        li[i].style.display = "none";
    }
    }
  }
  
  ngAfterViewInit() {
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 300;
    this.onListScroll();
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop = this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
      }, 500);
    }
  }
  
  replyMessage(event:any){
    this.isreplyMessage = true;
    document.querySelector('.replyCard')?.classList.add('show');
    var copyText = event.target.closest('.chat-list').querySelector('.ctext-content').innerHTML;
    (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .mb-0") as HTMLAreaElement).innerHTML = copyText;
    var msgOwnerName:any = event.target.closest(".chat-list").classList.contains("right") == true ? 'You' : document.querySelector('.username')?.innerHTML;
    (document.querySelector(".replyCard .replymessage-block .flex-grow-1 .conversation-name") as HTMLAreaElement).innerHTML = msgOwnerName;
  }

  copyMessage(event:any){
    navigator.clipboard.writeText(event.target.closest('.chat-list').querySelector('.ctext-content').innerHTML);
    (document.getElementById("copyClipBoard") as HTMLElement).style.display = "block";
    setTimeout(() => {
    (document.getElementById("copyClipBoard") as HTMLElement).style.display = "none";
    }, 1000);
  }

  get form() {
    return this.formData.controls;
  }
  
  SidebarHide() {
    const recentActivity = document.querySelector('.user-chat');
      if(recentActivity != null){
        recentActivity.classList.remove('user-chat-show');
      }
  }

  deleteMessage(event:any,data: MessageChat){
    event.target.closest('.chat-list').remove();

    this.response.Post("Chat","DeletarMensagem/" + data.idMensagemChat,{}).subscribe(
    (response: RetornoPadrao) =>{      
      if(!response.sucesso){       
        this.toastr.error(response.mensagem, 'Mensagem:');
      }
    })
  };
    
  openModal(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  infoUsuario(content: TemplateRef<any>) {    
    this.offcanvasService.open(content, { position: 'end' });
  }

  consultarMensagensDireta(){
    this.response.Get("Chat","ConsultarMensagensDireta/" + this.idUsuario).subscribe(
      (response: ChatContatoResponse) =>{        
        if(response.sucesso){
          response.data.lContatos.forEach(element => {
            this.lMensagensDireta.push(element)
          });
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }

        this.loadingSidebar = false;
      }
    );
  }

  deleteAllMessage(){
    var allMsgDelete:any = document.getElementById('users-conversation')?.querySelectorAll('.chat-list');
    
    allMsgDelete.forEach((item:any)=>{
      item.remove();
    })

    debugger
    let index = this.lMensagensDireta.findIndex(x => x.idContatoChat == this.userChat?.idContatoChat)
    if(index != -1){
      if(this.userChat != undefined){
        this.lMensagensDireta.splice(index, 1);
      }
    };

    let listIdsMensagens: Array<number> = [];

    this.chatMessagesData.forEach(element => {
      listIdsMensagens.push(element.idMensagemChat ?? 0);
    });

    this.response.Post("Chat","ExcluirConversa/",{
      IdUsuarioExclusao: localStorage.getItem('IdUsuario'),
      ListIdMensagemChat: listIdsMensagens
    }).subscribe(
    (response: RetornoPadrao) =>{      
      if(!response.sucesso){       
        this.toastr.error(response.mensagem, 'Mensagem:');
      };
    });
  }

  Search(){
    if(this.abaActive == 0){
      this.MessageDirectSearch();
    }
    else{
      this.ContactSearch();
    }
  }

  MessageDirectSearch(){
    var input:any, filter:any, ul:any, li:any, a:any | undefined, i:any, txtValue:any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".chat-user-list");
    ul.forEach((item:any)=>{
      let contNone = 1;
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
            li[i].style.display = "none";
            contNone = contNone + 1;
        }
      }
    })    
  }

  ContactSearch(){
    var input:any, filter:any, ul:any, li:any, a:any | undefined, i:any, txtValue:any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".contact-list");
    ul.forEach((item:any)=>{
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
      }
    })   
  }

   // Emoji Picker
   showEmojiPicker = false;
   sets:any = [
     'native',
     'google',
     'twitter',
     'facebook',
     'emojione',
     'apple',
     'messenger'
   ]
   set:any = 'twitter';
   toggleEmojiPicker() {
     this.showEmojiPicker = !this.showEmojiPicker;
   }
 
   addEmoji(event:any) {
     const { emoji } = this;
     const text = `${emoji}${event.emoji.native}`;
     this.emoji = text;
     this.showEmojiPicker = false;
   }
 
   onFocus() {
     this.showEmojiPicker = false;
   }
   onBlur() {
   }

   closeReplay(){
    document.querySelector('.replyCard')?.classList.remove('show');
  }

  getListConnected(){
    let list = new Observable<any[]>(observer => {
      this.response.connection.invoke('GetConnectedUsers')
        .then((users: any[] | undefined) => {
          observer.next(users);
        })
        .catch((error: any) => {
          observer.error(error);
        });
    })
    
    return list.subscribe(users => {
      this.listUserOnline = users;

      //Atualizar mensagem direta
      this.lMensagensDireta.forEach(element => {
        if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === element?.idUsuarioContato) == -1){
          element.online = false;
        }
        else{
          element.online = true;
        }
      });

      //Atualizar contato
      this.lContatos.forEach(elementContact => {
        elementContact.contacts.forEach(element => {
          if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === element?.idUsuarioContato) == -1){
            element.online = false;
          }
          else{
            element.online = true;
          }
        });
      });

      //Atualizar Usuario
      if(this.userChat != undefined){
        if(this.listUserOnline.findIndex(objeto => objeto.idUsuario === this.userChat?.idUsuarioContato) == -1){
          this.userChat.online = false;
        }
        else{
          this.userChat.online = true;
        }
      }
    });
  }
}
