import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductService } from 'src/app/business/product.service';
import { Categories, Products } from 'src/app/models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Map<number, Products[]> = new Map();
  category: any[] = [];


  isSearch = false;
  productsResult?: Products[];

  constructor( 
    private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getCategory().subscribe(r => {
      this.category = r;
      for(let cat of r) {
        this.productService.getProductByCategory(cat.categoryID).subscribe(r => {
           this.products.set(cat.categoryID, r);
           console.log(this.products);
        })
      }
    })
  }

  current: number | undefined;
  toggle(i: number) {
    if(this.current == i) {
      this.current = undefined;
    } else 
    this.current = i;
  }


  openSearchResult(res: Products[]) {
    this.isSearch = true;
    this.productsResult = res;
  }
}
