import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/business/config.service';
import { bricks } from './bricks';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit, AfterViewInit {
  company?: any[];
  constructor(
    private config: ConfigService,
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  instance: any;
  emmiter: any;

  create = new EventEmitter<any>();
  isAfterViewInit = false;
  ngOnInit(): void {
    this.titleService.setTitle('Клиенты');
    this.meta.updateTag({
      name: 'description',
      content: 'С нами работают крупные компании',
    });

    this.create.subscribe((r) => {
      console.log('INIT');
      if (this.company && this.isAfterViewInit) {
        console.log('INIT 2');
        setTimeout(() => {
          this.initSlider();
          this.resize({});
        }, 1);
      }
    });
    this.create.emit();
    this.config.getCompany().subscribe((r) => {
      this.company = r;
      this.create.emit();
    });
  }
  resize(ev: any) {
    if (this.instance) {
      this.emmiter();
    }
    console.log('MISS UPDATED SIZE BECAUSE LOADED IMAGE', event);
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
    this.emmiter = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        let loader = document.getElementById('load-place');
        let container = document.getElementById('load-waiter');
        if (!loader || !container) return;
        loader.style.display = 'none';
        container.className = Array.from(container.classList)
          .filter((r) => r != 'loading')
          .join(' ');
        this.instance.pack();
        console.log('UPDATED SIZE BECAUSE LOADED IMAGE');
      }, 300);
    };
  }
}
