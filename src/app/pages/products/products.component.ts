import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser'; 
import { ProductService } from 'src/app/business';
import { Categories, Products } from 'src/app/models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Map<number, Products[]> = new Map();
  category: any[] = [];

  isSearch = false;
  productsResult?: Products[];

  constructor(
    @Inject(ProductService) private productService: ProductService,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Заказать аптечку');
    this.meta.updateTag({
      name: 'description',
      content: 'Аптечки согласно приказов',
    });

    this.productService.getCategory().subscribe((r) => {
      this.category = r; 
      for (let cat of r) {
        this.productService
          .getProductByCategory(cat.categoryID)
          .subscribe((r) => {
            this.products.set(cat.categoryID, r); 
          });
      }
    });
  }

  current: number | undefined;
  toggle(i: number) {
    if (this.current == i) {
      this.current = undefined;
    } else this.current = i;
  }

  openSearchResult(res: Products[]) {
    this.isSearch = true;
    this.productsResult = res;
  }
}
