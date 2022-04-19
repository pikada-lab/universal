import { DOCUMENT, isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { debounceTime, timeout } from 'rxjs';
import { ProductService } from 'src/app/business'; 
import { bricks } from './bricks';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit, AfterViewInit {
  company?: any[];
  constructor( 
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: any,
    @Inject(ProductService) private productService: ProductService,
    private meta: Meta,
    private titleService: Title
  ) {}

  instance: any;
  emmiter = new EventEmitter();

  create = new EventEmitter<any>();
  isAfterViewInit = false;
  ngOnInit(): void {
    this.titleService.setTitle('Клиенты');
    this.meta.updateTag({
      name: 'description',
      content: 'С нами работают крупные компании',
    });

    this.create.pipe(debounceTime(100)).subscribe((r) => {
      if (this.company && this.isAfterViewInit) {
        this.initSlider();
        this.resize({});
      }
    });
    this.create.emit();
    this.productService.getCompany().subscribe((r) => {
      this.company = r;
      this.create.emit();
    });
    if (isPlatformServer(this.platformId)) {
      const element = this.document.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', 'https://aptechki.ru/clients');
      (this.document.getElementsByTagName('link')[0] as HTMLHeadElement).after(
        element
      );
    }
  }
  resize(ev: any) {
    if (this.instance) {
      this.emmiter.emit();
    }
    console.log('MISS UPDATED SIZE BECAUSE LOADED IMAGE', ev);
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'object') return;
    this.isAfterViewInit = true;
    this.create.emit();
  }

  initSlider() {
    const sizes = [
      { columns: 1, gutter: 14 },
      { mq: '880px', columns: 2, gutter: 14 },
      { mq: '1345px', columns: 3, gutter: 14 },
      { mq: '1680px', columns: 4, gutter: 14 },
    ];
    this.instance = bricks({
      container: '.clients__container',
      packed: 'data-packed',
      sizes: sizes,
      position: true,
    });
    this.instance.pack();
    this.instance.resize(true);
    let timer: any = 0;
    this.emmiter.pipe(debounceTime(300)).subscribe(() => {
      let loader = document.getElementById('load-place');
      let container = document.getElementById('load-waiter');
      if (!loader || !container) return;
      loader.style.display = 'none';
      container.className = Array.from(container.classList)
        .filter((r) => r != 'loading')
        .join(' ');
      this.instance.pack();
      console.log('UPDATED SIZE BECAUSE LOADED IMAGE');
    });
  }
}
