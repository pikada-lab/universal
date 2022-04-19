import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  url =
    'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A5f92c3f9b61894b30e5570056385b4950367025d84de1ccc0c7a5b2af9d797fa&amp;width=100%25&amp;height=720&amp;lang=ru_RU&amp;scroll=true';
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: any,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Контакты');
    this.meta.updateTag({
      name: 'description',
      content: 'Связаться с нами можно по телефону 8(800)200-96-97',
    });

    if (typeof document === 'object') {
      let map = document.getElementById('map-container');
      if (!map) return;
      let script = document.createElement('script');
      script.src = this.url;
      script.async = true;
      map.appendChild(script);
    }

    if (isPlatformServer(this.platformId)) {
      const element = this.document.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', 'https://aptechki.ru/contacts');
      (this.document.getElementsByTagName('link')[0] as HTMLHeadElement).after(
        element
      );
    }
  }
}
