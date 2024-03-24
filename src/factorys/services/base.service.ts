import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment.prod";
import * as signalR from '@microsoft/signalr'

@Injectable({
    providedIn: 'root'
})

export class BaseService{
    
    //Variaveis
    request : HttpClient;
    rota: string
    public connection: any;

    //Constructor
    constructor(http: HttpClient){
        this.request = http;
        this.rota = environment.link;
    }

    Get(controller: string,metodo: string){
        return this.request.get<any>(this.rota + controller + '/' + metodo)
    };
    
    Post(controller: string,metodo: string,objetoEnvio: any){
        return this.request.post<any>(this.rota + controller + '/' + metodo,objetoEnvio)
    };

    PostUrl(url: string,objetoEnvio: any){
        return this.request.post<any>(this.rota + url,objetoEnvio)
    };

    PostRelatorio(url: string,objetoEnvio: any){
        return this.request.post(this.rota + url,objetoEnvio,{observe:'response',responseType:'blob'})
    };

    GetRelatorio(url: string){
        return this.request.get(this.rota + url,{observe:'response',responseType:'blob'})
    };

    InitConnection(){
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(environment.link + 'chat')
            .withAutomaticReconnect() 
            .configureLogging(signalR.LogLevel.Information) 
            .withHubProtocol(new signalR.JsonHubProtocol()) 
            .build();
        this.connection.start().then(() => {
            this.connection.send("connectOnline",parseInt(localStorage.getItem('IdUsuario') ?? '0'));
        });  
    }

    CloseConnection(){
        this.connection.stop();
    }
};