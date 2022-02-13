import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from 'src/app/business/product.service';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent implements OnInit {
  @Output()
  search = new EventEmitter<Products[]>();

  q = '';
  constructor(private productService: ProductService) {}

  ngOnInit(): void { 
  }

  startSearch() { 
    this.productService.search(this.q).subscribe((r) => {
      this.search.emit(r);
    });
  }
}
