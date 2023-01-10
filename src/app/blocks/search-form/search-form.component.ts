import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ProductService } from 'src/app/business';
 
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
  constructor(@Inject(ProductService) private productService: ProductService) {}

  ngOnInit(): void { 
  }

  startSearch() { 
    this.productService.search(this.q).subscribe((r: any) => {
      this.search.emit(r);
    });
  }
  enter(event: KeyboardEvent) {
    console.log(event.code);
    if(event.code == 'Enter') {
      this.startSearch();
    }
  }
}
