import { Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/factorys/services/base.service';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { ELido } from '../../../enums/ELido';
import { NotificacaoRequest } from 'src/app/objects/Notificacao/NotificacaoRequestLida';
import { DataNotificacao } from 'src/app/objects/Notificacao/NotificacaoResponse';
import { EventService } from 'src/factorys/services/event.service';
import { LAYOUT_HORIZONTAL, LAYOUT_TWOCOLUMN, LAYOUT_VERTICAL } from 'src/app/objects/Main/layout.model';
import * as signalR from '@microsoft/signalr'
import { environment } from "src/environments/environment.prod";

@Component({
  selector: 'main-this.root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']

})

export class MainComponent implements OnInit{
  layoutType!: string;
  fullscreen: boolean = false;
  control = new FormControl('');
  fotoUser: string = window.localStorage.getItem('Foto') ?? "";
  listNotificacao: Array<DataNotificacao> = [];
  idUsuarioLogado: number = 0;
  notificaoSemLer: boolean = false;
  quantidadeSemLer: number = 0;
  root:any = document.getElementsByTagName('html')[0];

  constructor(private response: BaseService,private router: Router,private eventService: EventService){ 
    this.response.InitConnection();
  }

  NotificacaoLida = (notificacao: DataNotificacao) =>{
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

      if(this.quantidadeSemLer == 0){
        this.notificaoSemLer = false;
      }

      this.response.Post("Notificacao","NotificacaoLida", request).subscribe(); 
    }
  };

  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets!: Observable<string[]>;

  ngOnInit() {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.layoutType = LAYOUT_VERTICAL;
    document.body.setAttribute('layout',this.layoutType)

     // listen to event and change the layout, theme, etc
     this.eventService.subscribe('changeLayout', (layout) => {
      this.layoutType = layout;
    });

  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

   /**
  * Check if the vertical layout is requested
  */
   isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
   isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
   isTwoColumnLayoutRequested() {
    return this.layoutType === LAYOUT_TWOCOLUMN;
  }

}



