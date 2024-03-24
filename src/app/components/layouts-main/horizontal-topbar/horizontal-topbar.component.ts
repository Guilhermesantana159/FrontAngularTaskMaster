import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EstruturaMenu, MenuItem } from 'src/app/objects/Menus/menu.model';
import { BaseService } from 'src/factorys/services/base.service';

@Component({
  selector: 'app-horizontal-topbar',
  templateUrl: './horizontal-topbar.component.html',
  styleUrls: ['./horizontal-topbar.component.scss']
})
export class HorizontalTopbarComponent implements OnInit {
  menu: any;
  menuItems: MenuItem[] = [];
  idUsuarioLogado: number = 0;
  loading: boolean = false;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  
  constructor(private response: BaseService,private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.idUsuarioLogado = Number.parseInt(window.localStorage.getItem('IdUsuario') ?? '0');
    this.loading = true;
    this.response.Get("EstruturaMenu","ConsultarEstruturaMenus/" + this.idUsuarioLogado.toString()).subscribe(
      (response: EstruturaMenu) =>{        
        if(response.sucesso){
          this.menuItems = response.data.menu;
          this.loading = false;
        }else{
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
      }
    ); 
  }

   ngAfterViewInit() {
    this.initActiveMenu();
  }

  removeActivation(items: any) {   
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        (item.nextElementSibling) ? item.nextElementSibling.classList.remove("show") : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  activateParentDropdown(item: any) { 
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {      
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.setAttribute("aria-expanded", "true");
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active")); 
      this.removeActivation(activeItems);
      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  toggleSubItem(event: any) {
    if(event.target && event.target.nextElementSibling)
      event.target.nextElementSibling.classList.toggle("show");
  };

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');    
    
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
    dropDowns.forEach((node: any) => {
      node.classList.remove('show');
    });

    (isMenu) ? isMenu.classList.add('show') : null;

    const ul = document.getElementById("navbar-nav");
    if(ul){
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
      activeIconItems.forEach((item: any) => {
        item.setAttribute('aria-expanded', "false")
        item.classList.remove("active");
      });
    } 
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== null ? item.subItems.length > 0 : false;
  }
  
  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

}
