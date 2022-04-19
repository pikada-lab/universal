import { Component, Inject, OnDestroy, OnInit } from '@angular/core'; 
import { ProductService } from 'src/app/business';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
})
export class PopularComponent implements OnInit , OnDestroy {
  products!:  Products[];
  isSearch = false;
  productsResult?: Products[];
  constructor(@Inject(ProductService) private productService: ProductService) { }

  ngOnInit(): void {
    console.time("PopularComponent")
    this.productService.getPopular().subscribe(r => {
        this.products = r;
    })
  }
  ngOnDestroy(): void { 
    console.timeEnd("PopularComponent");
  }
  openSearchResult(res: Products[]) {
    this.isSearch = true;
    this.productsResult = res;
  }

}
