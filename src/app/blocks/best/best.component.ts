import { Component, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; 
import { ProductService } from 'src/app/business';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-best',
  templateUrl: './best.component.html',
  styleUrls: ['./best.component.css']
})
export class BestComponent implements OnInit {

   
  public product!: Products;
  img: any;

  constructor(@Inject(ProductService) private productService: ProductService, private ssd: DomSanitizer) { }

  ngOnInit(): void {
    this.productService.getProductById(52846).subscribe(r => {
      this.product = r;
    this.img = this.ssd.bypassSecurityTrustUrl(this.product.img);
    })
  }

}
