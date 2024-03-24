import { NgModule } from '@angular/core';
import { DataGridComponent } from './data-grid/data-grid.component';
import { TextErrorMessageComponent } from './text-error-message/text-error-message.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ConsultaModalComponent } from './consulta-modal/consulta-padrao.component';
import {MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CodeInputComponent } from './code-input/code-input.component';
import { MatTableModule } from '@angular/material/table'  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';
import { NoSanitizePipe } from 'src/factorys/utils/sanitize';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FooterComponent } from './layouts-main/footer/footer.component';
import { HorizontalTopbarComponent } from './layouts-main/horizontal-topbar/horizontal-topbar.component';
import { HorizontalComponent } from './layouts-main/horizontal/horizontal.component';
import { RightsidebarComponent } from './layouts-main/rightsidebar/rightsidebar.component';
import { SidebarComponent } from './layouts-main/sidebar/sidebar.component';
import { TopbarComponent } from './layouts-main/topbar/topbar.component';
import { TwoColumnSidebarComponent } from './layouts-main/two-column-sidebar/two-column-sidebar.component';
import { TwoColumnComponent } from './layouts-main/two-column/two-column.component';
import { VerticalComponent } from './layouts-main/vertical/vertical.component';
import { LanguageService } from 'src/factorys/services/language.service';
import { ToastrModule } from 'ngx-toastr';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { KanbanColumnComponent } from './column/column.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FooterLandingComponent } from './footer-landing/footer-landing.component';

const maskConfigFunction: () => Partial<IConfig> = () => {
    return {
      validation: true,
    };
};

@NgModule({
    declarations: [
      TextErrorMessageComponent,
      DataGridComponent,
      NoSanitizePipe,
      ConsultaModalComponent,
      CodeInputComponent,
      TaskComponent,
      VerticalComponent,
      TopbarComponent,
      SidebarComponent,
      FooterComponent,
      RightsidebarComponent,
      HorizontalComponent,
      FooterLandingComponent,
      KanbanColumnComponent,
      HorizontalTopbarComponent,
      TwoColumnComponent,
      TwoColumnSidebarComponent],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },LanguageService],
    exports: [
      TextErrorMessageComponent,
      DataGridComponent,
      ConsultaModalComponent,
      CodeInputComponent,
      TaskComponent,
      KanbanColumnComponent,
      VerticalComponent,
      FooterLandingComponent,
      TopbarComponent,
      SidebarComponent,
      FooterComponent,
      RightsidebarComponent,
      HorizontalComponent,
      HorizontalTopbarComponent,
      TwoColumnComponent,
      TwoColumnSidebarComponent],
    imports: [  
              CommonModule,
              NgSelectModule,
              RouterModule,
              NgbDropdownModule,
              NgbNavModule,
              SimplebarAngularModule,
              TranslateModule,
              MatPaginatorModule,
              MatSortModule,
              MatTooltipModule,
              MatIconModule,
              AutocompleteLibModule,
              MatDatepickerModule,
              MatNativeDateModule,
              NgbProgressbarModule,
              MatInputModule,
              MatTableModule,
              MatButtonModule,
              FormsModule,
              ReactiveFormsModule,
              DragDropModule,
              MatFormFieldModule,
              MatIconModule,
              MatSelectModule,
              ToastrModule.forRoot(({
                timeOut: 5000,
                enableHtml: true,
                progressBar: true,
                progressAnimation: 'decreasing',
                preventDuplicates: true
            }),), 
              MatProgressBarModule,
              MatChipsModule,
              MatAutocompleteModule,
              MatChipsModule,
              NgxMaskModule.forRoot(maskConfigFunction)
            ]
})

export class ComponentModule { }



