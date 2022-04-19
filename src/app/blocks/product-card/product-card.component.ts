import { Component, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; 
import { ProductService } from 'src/app/business';
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
  price: number = 0;
  constructor(private ssd: DomSanitizer, @Inject(ProductService) private productService: ProductService) { }

  ngOnInit(): void {
    if(this.product) {
     this.img = this.ssd.bypassSecurityTrustUrl(this.product.img);
     if(this.product.defaultCase && this.product.defaultCase != -1) {
       this.productService.getProductById(this.product.defaultCase).subscribe(r => {
        this.price = this.product.price + r.price;
       })
     } else 
     this.price = this.product.price;
    }
  }

}
