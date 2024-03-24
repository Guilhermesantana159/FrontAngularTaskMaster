import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'TaskMaster';

  isRefreshing = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.isRefreshing = true;
    alert('ola')
  }
}
