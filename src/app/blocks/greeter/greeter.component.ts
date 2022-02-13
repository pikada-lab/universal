import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/business/cart.service';
import { Cart } from 'src/app/models';
import { ToastService } from 'src/app/toast.service';

declare const createjs: any;
declare const window: any;
@Component({
  selector: 'app-greeter',
  templateUrl: './greeter.component.html',
  styleUrls: ['./greeter.component.css'],
})
export class GreeterComponent implements OnInit, OnDestroy {
  /** TODO Заменить на получение с сервера */
  imgList = [
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/1.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/2.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/3.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/4.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/5.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/6.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/7.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/8.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/10.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/11.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/12.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/13.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/14.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/15.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/16.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/17.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/18.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/19.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/20.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/21.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/22.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/23.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/24.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/25.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/26.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/27.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/28.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/29.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/30.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/31.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/32.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/33.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/34.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/35.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/36.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/37.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/38.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/39.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/40.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/41.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/42.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/43.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/44.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/45.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/46.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/47.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/48.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/49.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/50.png',
    'https://res.cloudinary.com/dewn0wy2s/image/upload/v1592668487/360/51.png',
  ];

  private stage: any;
  private rotate360Interval: any = undefined;
  private start_x: number = 0;
  private images: HTMLImageElement[] = [];
  private loaded: number = 0;
  private currentFrame: number = 0;
  private totalFrames: number = 0;

  isLoaded = false;
  bg: any;
  bmp: any;
  myTxt: any;
  canvas: HTMLCanvasElement | null = null;
  subscribe: Subscription | null = null;

  cart!: Cart;
  constructor(private router: Router, private cartService: CartService, private t: ToastService) {}

  ngOnInit(): void {
    if (typeof window === 'object') {
      if (document.readyState === 'complete') {
        this.initRotas();
      } else {
        window.addEventListener('load', () => this.initRotas(), false);
      }
    }
    this.cart = this.cartService.getMetadata();
  }
  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }
  initRotas() {
    this.isLoaded = true;
    this.totalFrames = this.imgList.length;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas || !this.canvas.getContext) return;

    this.stage = new createjs.Stage(this.canvas);
    this.stage.enableMouseOver(true);
    this.stage.mouseMoveOutside = true;
    createjs.Touch.enable(this.stage);

    this.bg = new createjs.Shape();
    this.stage.addChild(this.bg);

    this.bmp = new createjs.Bitmap();
    this.stage.addChild(this.bmp);

    this.myTxt = new createjs.Text('360', '24px Ubuntu', '#dd2958');
    this.myTxt.x = this.stage.canvas.width / 2;
    this.myTxt.y = this.stage.canvas.height / 2 - 30;
    this.myTxt.alpha = 1;
    this.myTxt.textAlign = 'center';
    this.stage.addChild(this.myTxt);

    // document.body.style.cursor = 'progress';
    this.load360Image();

    // TICKER
    createjs.Ticker.addEventListener('tick', () => this.handleTick());
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
  }
  private load360Image() {
    var img = new Image();
    img.src = this.imgList[this.loaded];
    img.onload = (event) => this.img360Loaded(event);
    this.images[this.loaded] = img;
  }
  private img360Loaded(event: any) {
    this.loaded++;
    this.bg.graphics.clear();
    const k = this.loaded / this.totalFrames;
    if (k == 1) {
      this.myTxt.alpha = 0;
      // bg.graphics.beginFill("#dd2958").drawRect(0, 0, (stage.canvas.width * loaded) / totalFrames, stage.canvas.height);
    } else {
      this.myTxt.text = `${Math.round(k * 100)}%`;
      this.bg.graphics
        .beginFill('#dd2958')
        .drawRect(
          10,
          this.stage.canvas.height / 2 - 1,
          ((this.stage.canvas.width - 20) * this.loaded) / this.totalFrames,
          2
        );
    }
    this.bg.graphics.endFill();

    if (this.loaded == this.totalFrames) this.start360();
    else this.load360Image();
  }

  private start360() {
    document.body.style.cursor = 'none';

    // 360 icon
    var iconImage = new Image();
    iconImage.src = '';
    iconImage.onload = (event) => this.iconLoaded(event);

    // update-draw
    this.update360(0);

    // first rotation
    this.rotate360Interval = setInterval(() => {
      if (this.currentFrame === this.totalFrames - 1) {
        clearInterval(this.rotate360Interval);
        this.addNavigation();
      }
      this.update360(1);
    }, 25);
  }
  private iconLoaded(event: Event) {
    var iconBmp = new createjs.Bitmap();
    iconBmp.image = event.target;
    iconBmp.x = 20;
    iconBmp.y = (this.canvas?.height ?? 0) - iconBmp.image.height - 20;
    this.stage.addChild(iconBmp);
  }

  private update360(dir: number) {
    this.currentFrame += dir;
    if (this.currentFrame < 0) this.currentFrame = this.totalFrames - 1;
    else if (this.currentFrame > this.totalFrames - 1) this.currentFrame = 0;
    this.bmp.image = this.images[this.currentFrame];
  }
  private addNavigation() {
    this.stage.onMouseOver = (event: any) => this.mouseOver(event);
    this.stage.onMouseDown = (event: any) => this.mousePressed(event);
    document.body.style.cursor = 'auto';
  }

  private mouseOver(event: Event) {
    document.body.style.cursor = 'pointer';
  }

  private mousePressed(event: any) {
    this.start_x = event.rawX;
    this.stage.onMouseMove = (event: any) => this.mouseMoved(event);
    this.stage.onMouseUp = (event: any) => this.mouseUp(event);

    document.body.style.cursor = 'w-resize';
  }

  private mouseMoved(event: any) {
    var dx = event.rawX - this.start_x;
    var abs_dx = Math.abs(dx);

    if (abs_dx > 5) {
      this.update360(dx / abs_dx);
      this.start_x = event.rawX;
    }
  }

  private mouseUp(event: any) {
    this.stage.onMouseMove = null;
    this.stage.onMouseUp = null;
    document.body.style.cursor = 'pointer';
  }

  private handleTick() {
    this.stage.update();
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
    this.cartService.save()
    console.log(!this.isValidMail, !this.isValidPhone, !this.cart.name, this.cart.name.length < 2);
    if(!this.isValidMail || !this.isValidPhone || !this.cart.name || this.cart.name.length < 2) {
      this.t.toast("Проверьте данные формы, все поля обязательны для заполнения");
      return;
    } 
    this.cartService.sendRequest().subscribe((id: number) => {
      this.t.toast("Запрос отправлен, номер заявки: "+id);
      this.openRequest.emit(false);
    })  
  }

  sendCallRequest() { 
    this.validPhone();
    this.cartService.save()
    if(!this.isValidPhone || !this.cart.name || this.cart.name.length < 2) {
      this.t.toast("Проверьте данные формы, все поля обязательны для заполнения");
      return;
    } 
    this.cartService.sendCallRequest().subscribe((id: number) => {
      this.t.toast("Звонок заказан, номер заявки: "+id);
      this.open.emit(false); 
    });
  }
  validMail() {
    if (/(.{1,}?)@(.{1,}?)\.(.{2,}?)/.test(this.cart.mail)) {
      this.isValidMail = true;
    } else {
      this.isValidMail = false;
    }
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
