import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-header></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
  <app-cart></app-cart>
  <app-process></app-process>`,
  styleUrls: []
})
export class AppComponent {
  title = 'Аптечки ру';
}
