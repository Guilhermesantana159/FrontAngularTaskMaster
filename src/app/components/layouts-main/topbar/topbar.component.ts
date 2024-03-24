import { Component, OnInit, EventEmitter, Output, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventService } from '../../../../factorys/services/event.service';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../../../factorys/services/language.service';
import { Router } from '@angular/router';
import { ELido } from 'src/app/enums/ELido';
import { DataNotificacao, NotificacaoResponse } from 'src/app/objects/Notificacao/NotificacaoResponse';
import { BaseService } from 'src/factorys/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { NotificacaoRequest } from 'src/app/objects/Notificacao/NotificacaoRequestLida';
import { EstruturaAutoCompleteMenu, PageItem } from 'src/app/objects/Menus/autocomplete-menu.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  fotoUser: string = window.localStorage.getItem('Foto') ?? "";
  nameUser: string = window.localStorage.getItem('NomeUsuario') ?? "";
  perfil: boolean = (window.localStorage.getItem('Perfil') == 'true') ?? false;
  listNotificacao: Array<DataNotificacao> = [];
  pagesList: Array<PageItem> = [];
  idUsuarioLogado: number = 0;
  notificaoSemLer: boolean = false;
  quantidadeSemLer: number = 0;
  @ViewChild('auto') auto:any;

  constructor(@Inject(DOCUMENT) private document: any, private eventService: EventService, public languageService: LanguageService,private router: Router,
    public _cookiesService: CookieService,private response: BaseService,private toastr: ToastrService) {
      this.idUsuarioLogado = parseInt(window.localStorage.getItem('IdUsuario') ?? "0");
      this.response.Get("Notificacao","GetNotificacoesByUser/" + this.idUsuarioLogado).subscribe(
        (response: NotificacaoResponse) =>{        
          if(response.sucesso){
            response.data.itens.forEach(element => {
                if(element.lido == ELido.Nao){
                  this.quantidadeSemLer++;
                }
                this.notificaoSemLer = true;
  
              this.listNotificacao.push(element);
            });
          }else{
            this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
          }
        }
      ); 

      this.response.Get("EstruturaMenu","ConsultarAutoCompleteMenu/" + this.idUsuarioLogado).subscribe(
        (response: EstruturaAutoCompleteMenu) =>{        
          if(response.sucesso){
            this.pagesList = response.data.pages;

            this.pagesList.push({url: '/main-dashboard',nome: 'Home Dashboard'});
          }else{
            this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
          }
        }
      ); 
  
     }

  ngOnInit(): void {
    this.element = document.documentElement;

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = '../../../../assets/images/flags/br.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    if (document.documentElement.clientWidth <= 1024) {
      document.documentElement.setAttribute('data-sidebar-size', 'sm');
    }

  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
    if (document.documentElement.clientWidth <= 1024) {
      if (document.documentElement.getAttribute('data-layout') == 'vertical') {
        (document.documentElement.getAttribute('data-sidebar-size') == "sm") ? document.documentElement.setAttribute('data-sidebar-size', 'lg') : document.documentElement.setAttribute('data-sidebar-size', 'sm')
      }
      if (document.documentElement.getAttribute('data-layout') == 'horizontal')
        document.body.classList.toggle('menu');
    }
    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle('vertical-sidebar-enable');
      document.documentElement.setAttribute('data-sidebar-size', 'lg')
    }
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.body.setAttribute('data-layout-mode', "light");
        document.body.setAttribute('data-sidebar', "light");
        break;
      case 'dark':
        document.body.setAttribute('data-layout-mode', "dark");
        document.body.setAttribute('data-sidebar', "dark");
        break;
      default:
        document.body.setAttribute('data-layout-mode', "light");
        break;
    }
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'Português', flag: '../../../../assets/images/flags/br.svg', lang: 'pt-br' }
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */
  logout() {
    window.localStorage.clear();
    this.response.CloseConnection();
    this.router.navigateByUrl('/login');
  }

  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow')
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
    }
  }

  selectEvent(item: PageItem) { 
    this.router.navigateByUrl(item.url);
    this.auto.clear();
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

  EditarPerfil = () => {
    let id = window.localStorage.getItem('IdUsuario');
    
    this.router.navigateByUrl('/main-dashboard/entities/usuario/' + id + '/editar');
  };

  NotificacaoLida = (notificacao: DataNotificacao) =>{
    if(notificacao.lido == ELido.Sim){
      return;      
    }

    if(notificacao.lido == ELido.Nao){
      this.listNotificacao.forEach(element => {
        if(element == notificacao){
          element.lido = ELido.Sim;
        }
      });

      let request: NotificacaoRequest = {
        IdNotificaoLida: notificacao.idNotificacao
      }; 

      this.quantidadeSemLer = this.quantidadeSemLer - 1;

      this.response.Post("Notificacao","NotificacaoLida", request).subscribe(); 
    }
  };

  formatTimeAgo(dateString: Date) {
    let date = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;
  
    if (timeDifference < millisecondsPerMinute) {
      const seconds = Math.round(timeDifference / 1000);
      return `${seconds} segundo${seconds !== 1 ? 's' : ''} atrás`;
    } else if (timeDifference < millisecondsPerHour) {
      const minutes = Math.round(timeDifference / millisecondsPerMinute);
      return `${minutes} minuto${minutes !== 1 ? 's' : ''} atrás`;
    } else if (timeDifference < millisecondsPerDay) {
      const hours = Math.round(timeDifference / millisecondsPerHour);
      return `${hours} hora${hours !== 1 ? 's' : ''} atrás`;
    } else {
      const days = Math.round(timeDifference / millisecondsPerDay);
      return `${days} dia${days !== 1 ? 's' : ''} atrás`;
    }
  }
  

}


