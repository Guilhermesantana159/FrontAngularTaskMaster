import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})

/**
 * Horizontal Component
 */
export class HorizontalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-layout', 'horizontal');
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-layout-style', 'default');
    document.documentElement.setAttribute('data-layout-mode', 'light');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');
    if (document.documentElement.clientWidth <= 1024) {
      (document.documentElement.getAttribute('data-sidebar-size') == "sm") ? document.documentElement.setAttribute('data-sidebar-size', 'lg') : document.documentElement.setAttribute('data-sidebar-size', 'sm')
    }
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");
    }
  }
}
