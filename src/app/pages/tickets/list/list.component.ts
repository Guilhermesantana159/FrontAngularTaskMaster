import { Component, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { ListModel } from './list.model';
import { Orders } from './data';
import { ListService } from './list.service';
import { NgbdListSortableHeader, SortEvent } from './list-sortable.directive';

// Date Format
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ListService, DecimalPipe]
})

/**
 * List Component
 */
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  ordersForm!: UntypedFormGroup;
  CustomersData!: ListModel[];
  masterSelected!: boolean;
  checkedList: any;
  submitted = false;

  // Api Data
  content?: any;
  lists?: any;
  econtent?: any;

  // Table data
  ticketsList!: Observable<ListModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdListSortableHeader) headers!: QueryList<NgbdListSortableHeader>;

  constructor(private modalService: NgbModal, public service: ListService, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe) {
    this.ticketsList = service.lists$;
    this.total = service.total$;
  }


  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Invoices' },
      { label: 'Invoice List', active: true }
    ];

    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      id: ['#VLZ5'],
      ids: [''],
      title: ['', [Validators.required]],
      client: ['', [Validators.required]],
      assigned: ['', [Validators.required]],
      create: ['', [Validators.required]],
      due: ['', [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]]
    });

    /**
     * fetches data
     */
    setTimeout(() => {
      this.ticketsList.subscribe(x => {
        this.content = this.lists;
        this.lists = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000);
  }

  /**
 * Confirmation mail model
 */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
  }

  /**
  * Multiple Delete
  */
  checkedValGet: any[] = [];
  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var result
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    }
    else {
      Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#239eba', });
    }
    this.checkedValGet = checkedVal;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.lists.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.lists.length; i++) {
      if (this.lists[i].state == true) {
        result = this.lists[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.lists.length; i++) {
      if (this.lists[i].state == true) {
        result = this.lists[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.ordersForm.controls;
  }

  /**
    * Save user
    */
  saveUser() {
    
  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Ticket';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
  }

  // Filtering
  isstatus?: any
  SearchData() {
    var status = document.getElementById("idStatus") as HTMLInputElement;
    var date = document.getElementById("isDate") as HTMLInputElement;
    var dateVal = date.value ? this.datePipe.transform(new Date(date.value), "yyyy-MM-dd") : '';
    if (status.value != 'all' && status.value != '' || dateVal != '') {
      this.lists = this.content.filter((ticket: any) => {
        return this.datePipe.transform(new Date(ticket.create), "yyyy-MM-dd") == dateVal || ticket.status === status.value;
      });
    }
    else {
      this.lists = this.content;
    }
  }

}
