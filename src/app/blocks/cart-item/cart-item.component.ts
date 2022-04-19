import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/business';
import { CartService } from 'src/app/business/cart.service'; 
import { CartItem, Products } from 'src/app/models';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent implements OnInit {
  @Input()
  item!: CartItem;

  product: Products | undefined;

  img?: SafeResourceUrl;

  openSmeta = new EventEmitter<boolean>();

  buttonsSmeta = [
    {
      title: 'Перейти к товару',
      event: () => {
        if (this.product) {
          this.router.navigateByUrl(
            '/products/' + this.product.id + '#custom-order'
          );
        }
        this.openSmeta.emit(false);
      },
    },
    {
      title: 'Закрыть',
      event: () => {
        this.openSmeta.emit(false);
      },
    },
  ];

  summ = 0;
  constructor(
    private router: Router,
    private cartService: CartService,
    private ssd: DomSanitizer,
   @Inject(ProductService) private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.calc();
    this.productService.getProductById(this.item.productId).subscribe((r) => {
      this.product = r;
      if(this.item.caseId === -1) {
        this.img = this.ssd.bypassSecurityTrustResourceUrl(this.product.img);
      }
    });
    if (this.item.caseId !== -1) {
      this.productService.getProductById(this.item.caseId).subscribe((r) => {
        this.img = this.ssd.bypassSecurityTrustResourceUrl(r.img);
      });
    } 
  }

  setQtty(n: number) {
    this.item.qtty = n;
    this.calc();
    this.cartService.save();
  }

  calc() {
    this.summ = this.item.qtty * (this.item.price + this.item.priceCase);
  }

  remove() {
    this.cartService.remove(this.item);
  }

  getIcon(type: string) {
    return this.cartService.getIcon(type);
  }
}
