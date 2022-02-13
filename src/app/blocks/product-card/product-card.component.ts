import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input()
  product!: Products; 
  img: any
  constructor(private ssd: DomSanitizer) { }

  ngOnInit(): void {
    if(this.product) {
     this.img = this.ssd.bypassSecurityTrustUrl(this.product.img);
    }
  }

}
