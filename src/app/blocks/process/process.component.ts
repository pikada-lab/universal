import { Component, OnInit } from '@angular/core';
import { CartService, LoadedValue } from 'src/app/business/cart.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
})
export class ProcessComponent implements OnInit {
  get process(): LoadedValue[] {
    return this.cart.process;
  }
  constructor(private cart: CartService) {}

  ngOnInit(): void {}

  getProcent(value: LoadedValue) {
    return Math.round(((value.loaded ?? 0) / (value.total ?? 1)) * 10000) / 100;
  }

  cancel(id: number) {
    this.cart.deleteProcess(id);
  }
}
