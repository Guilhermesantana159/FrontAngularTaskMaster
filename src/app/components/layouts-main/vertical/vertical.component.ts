import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../factorys/services/event.service';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss']
})
export class VerticalComponent implements OnInit {

  isCondensed = false;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    if (document.documentElement.getAttribute('data-layout') == 'semibox') {
      document.documentElement.setAttribute('data-layout', 'semibox');
    }
    else {
      document.documentElement.setAttribute('data-layout', 'vertical');
    }
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    document.documentElement.setAttribute('data-layout-style', 'default');
    document.documentElement.setAttribute('data-layout-mode', 'light');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');
    window.addEventListener('resize', function () {
      if (document.documentElement.clientWidth <= 767) {
        document.documentElement.setAttribute('data-sidebar-size', '');
      }
      else if (document.documentElement.clientWidth <= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'sm');
      }
      else if (document.documentElement.clientWidth >= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
      }
    })
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    const currentSIdebarSize = document.documentElement.getAttribute("data-sidebar-size");
    this.isCondensed = !this.isCondensed;
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

  onResize(event: any) {
    if (document.body.getAttribute('layout') == "twocolumn") {
      if (event.target.innerWidth <= 767) {
        this.eventService.broadcast('changeLayout', 'vertical');
      } else {
        this.eventService.broadcast('changeLayout', 'twocolumn');
        document.body.classList.remove('twocolumn-panel');
        document.body.classList.remove('vertical-sidebar-enable');
      }
    }
  }

}
