import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

declare const createjs: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: any
  ) {}
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      const element = this.document.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', 'https://aptechki.ru/home');
      (this.document.getElementsByTagName('link')[0] as HTMLHeadElement).after(
        element
      );
    }
  }
}
