import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule, NgbDropdownModule, NgbAccordionModule, NgbProgressbarModule, NgbNavModule, NgbPaginationModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

// Load Icon
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';
// Ck Editer
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// Counter
import { CountToModule } from 'angular-count-to';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

//  Drag and drop
import { DndModule } from 'ngx-drag-drop';

// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';

// NG2 Search Filter
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// drag and droup row table
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';

// Component Pages
import { AppsRoutingModule } from "./apps-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { EmailBasicComponent } from './email/email-basic/email-basic.component';
import { EmailEcommerceComponent } from './email/email-ecommerce/email-ecommerce.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { TodoComponent } from './todo/todo.component';

import { DatePipe } from '@angular/common';

import { SortByPipe } from '../apps/sort-by.pipe';
import { ApikeyComponent } from './apikey/apikey.component';

// Mask
import {IConfig, NgxMaskModule } from 'ngx-mask';

// Sorting page
import { NgbdApikeySortableHeader } from './apikey/apikey-sortable.directive';

// Swiper Slider
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: true,
  };
};


@NgModule({
  declarations: [
    CalendarComponent,
    ChatComponent,
    MailboxComponent,
    WidgetsComponent,
    EmailBasicComponent,
    EmailEcommerceComponent,
    FileManagerComponent,
    TodoComponent,
    SortByPipe,
    ApikeyComponent,
    NgbdApikeySortableHeader
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    FeatherModule.pick(allIcons),
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    CKEditorModule,
    CountToModule,
    NgApexchartsModule,
    LeafletModule,
    AppsRoutingModule,
    SharedModule,
    PickerModule,
    DndModule,
    NgSelectModule,
    DragDropModule,
    MatTableModule,
    Ng2SearchPipeModule,
    NgxUsefulSwiperModule,
    NgxMaskModule.forRoot(maskConfigFunction)
  ],
  providers: [
    DatePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
