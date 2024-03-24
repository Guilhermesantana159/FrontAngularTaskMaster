import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultaModal } from 'src/app/objects/Consulta-Padrao/consulta-modal';
import { ConsultaModalParams } from 'src/app/objects/Consulta-Padrao/ConsultaModalParams';
import { GridService } from '../data-grid/data-grid.service';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'consulta-padrao',
  templateUrl: './consulta-padrao.component.html'
})

export class ConsultaModalComponent implements OnInit{
  @Input() ParamsConsulta!: ConsultaModalParams;
  @Input() selectedText!: string;
  @Input() multiForm!: string;
  @Input() disabled!: boolean;
  @Input() selectedValue!: string;
  @Output() valueChange = new EventEmitter();
  form!: FormGroup;

  //Modal
  ConsultaModal!: ConsultaModal;
  gridOptions: any;

  constructor(private gridService: GridService,public rootFormGroup: FormGroupDirective){
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    this.ConsultaModal = {
      SelectedText: this.form.get(this.selectedText)?.value,
      SelectedValue: undefined
    }
    this.gridOptions = this.ParamsConsulta.GridOptions;

    this.gridService.selecionar.subscribe((data: any) => {
      if(!this.gridOptions.Parametros.MultiModal){
        if(this.gridOptions.Parametros.Modal?.SelectedText != undefined &&
          this.gridOptions.Parametros.Modal?.SelectedText != undefined){

          //Monitoramento de changes
          this.ConsultaModal.SelectedText = data[this.gridOptions.Parametros.Modal?.SelectedText];
          this.ConsultaModal.SelectedValue = data[this.gridOptions.Parametros.Modal?.SelectedValue];

          //Atribuição no formulário
          this.form.get(this.selectedText)?.setValue(this.ConsultaModal.SelectedText);
          this.form.get(this.selectedValue)?.setValue(this.ConsultaModal.SelectedValue);
        }
      }
      else{
        if(this.gridOptions.Parametros.Modal?.SelectedText != undefined &&
          this.gridOptions.Parametros.Modal?.SelectedText != undefined){

          //Monitoramento de changes
          this.ConsultaModal.SelectedText = data[this.gridOptions.Parametros.Modal?.SelectedText];
          this.ConsultaModal.SelectedValue = data[this.gridOptions.Parametros.Modal?.SelectedValue];

          let item: ConsultaModal = {
            SelectedText: data[this.gridOptions.Parametros.Modal?.SelectedText],
            SelectedValue: data[this.gridOptions.Parametros.Modal?.SelectedValue],
          }

          //Alimentacao
          let repeat: boolean = false;
          
          if(this.form.get(this.multiForm)?.value == undefined || this.form.get(this.multiForm)?.value == null){
            this.form.get(this.multiForm)?.setValue([]);
          }

          this.form.get(this.multiForm)?.value.forEach((element: { SelectedText: string | undefined; SelectedValue: string | undefined; }) => {
            if(element.SelectedText == item.SelectedText && element.SelectedValue == item.SelectedValue){
              repeat = true;
            }
          });

          if(!repeat){
            this.form.get(this.multiForm)?.value.push(item);
          }
        }
      }
    });  
  }

  ResetConsultaPadrao(){
    this.ConsultaModal ={
      SelectedText: '',
      SelectedValue: undefined
    };

    this.form.get(this.multiForm)?.setValue([]);
    this.form.get(this.selectedText)?.setValue(undefined);
    this.form.get(this.selectedValue)?.setValue(undefined);
  }

  Remove(item: ConsultaModal){
    if(this.form.get(this.multiForm)?.value == undefined || this.form.get(this.multiForm)?.value == null){
      this.form.get(this.multiForm)?.setValue([]);
    }
    
    for (let index = 0; index < this.form.get(this.multiForm)?.value.length; index++) {
      if(this.form.get(this.multiForm)?.value[index].SelectedText == item.SelectedText && this.form.get(this.multiForm)?.value[index].SelectedValue == item.SelectedValue){
        this.form.get(this.multiForm)?.value.splice(index,1);
        break;
      }
    }
  }

}
