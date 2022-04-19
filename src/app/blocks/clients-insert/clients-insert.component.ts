import { AfterViewInit, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { ProductService } from 'src/app/business';
import { initSlider } from './slider';

@Component({
  selector: 'app-clients-insert',
  templateUrl: './clients-insert.component.html',
  styleUrls: ['./clients-insert.component.css'],
})
export class ClientsInsertComponent implements OnInit, AfterViewInit {
  company?: any[];
  isAfterViewInit = false;
  create = new EventEmitter();
  constructor(@Inject(ProductService) private productService: ProductService) {}

  ngAfterViewInit(): void {
    this.isAfterViewInit = true;
    this.create.emit(); 
  }

  ngOnInit(): void {
    this.productService.getCompany().subscribe((r) => {
      this.company = r.slice(0, 10); 
      this.create.emit();
    });
    this.create.subscribe(r => {
      if(this.company && this.isAfterViewInit) {
        setTimeout(() => {
          initSlider();
        },500)
      }
    })
  }
}
