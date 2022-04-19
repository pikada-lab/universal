import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/business/cart.service';
import { Cart } from 'src/app/models';
import { ToastService } from 'src/app/toast.service';

declare const ym: any;

@Component({
  selector: 'app-greeter-static',
  templateUrl: './greeter-static.component.html',
  styleUrls: ['./greeter-static.component.css'],
})
export class GreeterStaticComponent implements OnInit , OnDestroy{

  cart!: Cart;

  constructor(
    @Inject(DOCUMENT) private document: any, 
    private cartService: CartService, 
    private t: ToastService
  ) {
    console.time("GreeterStaticComponent");
  }

  ngOnInit(): void {

    this.cart = this.cartService.getMetadata(); 
    this.validPhone();
    this.validMail();
    this.validName(); 
    
  }
  ngOnDestroy(): void { 
    console.timeEnd("GreeterStaticComponent");
  }

  showLayer(event: MouseEvent) {
    let strategy = {
      layer1: 300,
      layer2: 450,
      layer3: 600,
    };
    if (window.innerWidth < 1380) {
      strategy.layer1 = 250;
      strategy.layer2 = 370;
      strategy.layer3 = 460;
    }
    if (window.innerWidth < 1064) {
      strategy.layer1 = 220;
      strategy.layer2 = 350;
      strategy.layer3 = 430;
    }
    if (window.innerWidth < 840) {
      strategy.layer1 = 160;
      strategy.layer2 = 223;
      strategy.layer3 = 272;
    }
    if (event.offsetY > strategy.layer1) {
      this.document.getElementById('layer-1').classList.add('hide');
    } else {
      this.document.getElementById('layer-1').classList.remove('hide');
    }
    if (event.offsetY > strategy.layer2) {
      this.document.getElementById('layer-2').classList.add('hide');
    } else {
      this.document.getElementById('layer-2').classList.remove('hide');
    }
    if (event.offsetY > strategy.layer3) {
      this.document.getElementById('layer-3').classList.add('hide');
    } else {
      this.document.getElementById('layer-3').classList.remove('hide');
    }
  }
  showLayers() {
    this.document.getElementById('layer-1').classList.remove('hide');
    this.document.getElementById('layer-2').classList.remove('hide');
    this.document.getElementById('layer-3').classList.remove('hide');
  }


  open = new EventEmitter<boolean>();
  openRequest = new EventEmitter<boolean>();
  isValidMail = false;
  requestButtons = [{
    title: "Отправить запрос",
    event: () => this.sendRequest()
  }];
  callButtons = [{
    title: "Заказать звонок",
    event: () => this.sendCallRequest()
  }];

  sendRequest() { 
    this.validPhone();
    this.validMail();
    this.validName();
    this.cartService.save()
    if(!this.isValidMail || !this.isValidPhone || !this.isValidName) {
      this.t.toast("Проверьте данные формы, все поля обязательны для заполнения");
      return;
    } 
    this.cartService.sendRequest().subscribe((res: {response: number}) => {
      this.t.toast("Запрос отправлен, номер заявки: "+ res.response);
      this.openRequest.emit(false);

      if(typeof ym != 'undefined') {
        ym(87712774,'reachGoal','request')
        }
    })  
  }

  sendCallRequest() { 
    this.validPhone();
    this.cartService.save()
    if(!this.isValidPhone || !this.cart.name || this.cart.name.length < 2) {
      this.t.toast("Проверьте данные формы, все поля обязательны для заполнения");
      return;
    } 
    this.cartService.sendCallRequest().subscribe((res: {response: number}) => {
      this.t.toast("Звонок заказан, номер заявки: "+ res.response);
      this.open.emit(false); 
      if(typeof ym != 'undefined') {
        ym(87712774,'reachGoal','call')
        }
    });
  }
  validMail() {
    if (/(.{1,}?)@(.{1,}?)\.(.{2,}?)/.test(this.cart.mail)) {
      this.isValidMail = true;
    } else {
      this.isValidMail = false;
    }
  }
  isValidName = false;
  validName() {
    this.isValidName = !!this.cart.name && this.cart.name.length > 2;
  }
  isValidPhone = false;
  validPhone() {
    this.cart.phone = this.cart.phone.replace(/\D/g, '');
    if (!this.cart.phone) {
      this.isValidPhone = false;
      return false;
    }

    if (/([7|8]{1}\d{10})/.test(this.cart.phone)) {
      this.cart.phone = `+7 (${this.cart.phone.slice(
        1,
        4
      )}) ${this.cart.phone.slice(4, 7)} - ${this.cart.phone.slice(
        7,
        9
      )} - ${this.cart.phone.slice(9, 11)}`;

      this.isValidPhone = true;
      return true;
    }

    if (/([1|2|3|4|5|6|9|0]{1}\d{9})/.test(this.cart.phone)) {
      this.cart.phone = `+7 (${this.cart.phone.slice(
        0,
        3
      )}) ${this.cart.phone.slice(3, 6)} - ${this.cart.phone.slice(
        6,
        8
      )} - ${this.cart.phone.slice(8, 10)}`;

      this.isValidPhone = true;
      return true;
    }

    this.isValidPhone = false;
    return false;
  }
  save() { 
    this.cartService.save();
  }
}
