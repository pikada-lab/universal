import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router'; 
import { CartService } from 'src/app/business/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  isShow: boolean = false;

  constructor(  private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(r => { 
      if(r instanceof ActivationEnd) { 
        this.isShow = true;
        switch(r.snapshot.url[0].path) {
          case "cart": 
            this.isShow = false;
          break;
        }
      }
    })
  }

  calc() {
    return this.cartService.calc();
  }

  countItem() {
    return this.cartService.getAll().length;
  }

}
