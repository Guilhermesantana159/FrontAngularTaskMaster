import { EventEmitter, Injectable } from "@angular/core";
import { ETipoArquivo } from "src/app/enums/ETipoArquivo";

@Injectable({
    providedIn: 'root'
})

export class GridService{
    public recarregar = new EventEmitter(); 
    public relatorio = new EventEmitter(); 
    public selecionar = new EventEmitter<any>(); 

    public RecarregarGrid()
    {
        this.recarregar.emit(); 
    };

    public EmitirRelatorio(tipo: ETipoArquivo)
    {
        this.relatorio.emit(tipo); 
    };
 
    public SelecionarModal(data: any)
    {
        this.selecionar.emit(data); 
    };
    
}