import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/business/product.service';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
})
export class PopularComponent implements OnInit {
  products!:  Products[];
  isSearch = false;
  productsResult?: Products[];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getPopular().subscribe(r => {
        this.products = r;
    })
  }

  openSearchResult(res: Products[]) {
    this.isSearch = true;
    this.productsResult = res;
  }

}
