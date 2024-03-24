import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario-grid/usuario-grid.component';
import { UsuarioCrudComponent } from './usuario/usuario-crud/usuario-crud.component';
import { MaintenanceComponent } from './extrapages/maintenance/maintenance.component';
import { ProjetoComponent } from './projeto/projeto-grid/projeto-grid.component';
import { ProjetoCrudComponent } from './projeto/projeto-crud/projeto-crud.component';
import { KambamTarefasComponent } from './kamban-tarefas/kamban-tarefas/kamban-tarefas.component';
import { KambamGridTarefasComponent } from './kamban-tarefas/kamban-tarefas-grid/kamban-tarefas-grid.component';
import { DetalhesTarefasComponent } from './detalhes-tarefas/detalhes-tarefas.component';
import { AdministracaoTarefasComponent } from './administracao-tarefas/administracao-tarefas-grid/administracao-tarefas-grid.component';
import { AdministracaoTarefasCrudComponent } from './administracao-tarefas/administracao-tarefas-crud/Administracao-tarefas-crud.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { CronogramaGridComponent } from './cronograma/cronograma-grid/cronograma-grid.component';
import { CronogramaComponent } from './cronograma/cronograma-crud/cronograma.component';
import { TemplateComponent } from './template/template-grid/template-grid.component';
import { TemplateCrudComponent } from './template/template-crud/template-crud.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  { 
    path: 'kamban-tarefas', 
    component: KambamGridTarefasComponent,
  },
  { 
    path: 'kamban-tarefas/:id/registro', 
    component: KambamTarefasComponent 
  },
  { 
    path: 'projeto', 
    component: ProjetoComponent,
  },
  { 
    path: 'projeto/:id/editar', 
    component: ProjetoCrudComponent 
  },
  { 
    path: 'template', 
    component: TemplateComponent,
  },
  { 
    path: 'template/:id/editar', 
    component: TemplateCrudComponent 
  },
  { 
    path: 'template/:id/ver', 
    component: TemplateCrudComponent 
  },
  { 
    path: 'template/registro/novo', 
    component: TemplateCrudComponent,
  },
  { 
    path: 'projeto/registro/novo', 
    component: ProjetoCrudComponent 
  }, 
  { 
    path: 'usuario', 
    component: UsuarioComponent,
  },
  { 
    path: 'usuario/:id/editar', 
    component: UsuarioCrudComponent 
  },
  { 
    path: 'usuario/registro/novo', 
    component: UsuarioCrudComponent 
  }, 
  {
    path: "manutencao/error/500",
    component: MaintenanceComponent
  },
  {
    path: "detalhes-tarefas/:id",
    component: DetalhesTarefasComponent
  },
  {
    path: "administracao-tarefas",
    component: AdministracaoTarefasComponent
  },
  {
    path: "administracao-tarefas/:id",
    component: AdministracaoTarefasCrudComponent
  },
  {
    path: "time-line/:id",
    component: TimeLineComponent

  },
  {
    path: "cronograma",
    component: CronogramaGridComponent
  },
  {
    path: "cronograma/:id",
    component: CronogramaComponent
  },
  {
    path: "chat",
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesPagesRoutingModule { }
