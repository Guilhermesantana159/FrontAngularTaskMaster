import { Component, Input, OnInit } from '@angular/core';
import { TarefaListResponse } from 'src/app/objects/Tarefa/TarefaAdmResponse';

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
  host: {
    class: "task"
  }
})

export class TaskComponent implements OnInit {
  @Input() taskModel!: TarefaListResponse;

  constructor() {}

  ngOnInit() {}

  public get Id(): string {
    return this.taskModel.statusEnum.toString()
  }
}