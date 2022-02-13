import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { debounceTime } from 'rxjs';
import { CartService } from 'src/app/business/cart.service';
import { Cart, CartItem } from 'src/app/models';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartPageComponent implements OnInit {
  items!: CartItem[];
  cart!: Cart;

  savePipe = new EventEmitter<void>();

  @ViewChild('file', { static: true })
  customeFile!: ElementRef<HTMLInputElement>;
  maxCustomDescription = 2000;

  constructor(private cartService: CartService, private t: ToastService) {}

  ngOnInit(): void {
    this.items = this.cartService.getAll();
    this.cart = this.cartService.getMetadata();
    this.validPhone();
    this.validMail();
    this.savePipe.pipe(debounceTime(1000)).subscribe(() => {
      this.cartService.save();
    });
  }

  calc() {
    return this.cartService.calc();
  }
  save() {
    this.savePipe.emit();
  }
  isValidMail = false;

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
      return;
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
      return;
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
      return;
    }

    this.isValidPhone = false;
    return;
  }

  saveFiles() {
    if (this.customeFile.nativeElement.files) {
      this.cartService
        .uploadFile(this.customeFile.nativeElement.files)
        .then((file) => {
          if (file) {
            this.cart.customDescriptionFile.push(...file);
            this.cartService.save();
          }
        });
    }
  }

  deleteFile(file: string) {
    this.cartService.deleteFileCart(file);
  }
  getIcon(type: string) {
    return this.cartService.getIcon(type);
  }

  openForm = new EventEmitter<boolean>();
  id: number = 0;
  order() {
    if(!this.isValidMail) return this.t.toast("Проверьте правильность заполнения почты","error")
    if(!this.isValidPhone) return this.t.toast("Проверьте правильность заполнения телефона","error")
    if(!this.cart.name) return this.t.toast("Нет ФИО","error")
    if(this.cart.name.length < 3) return this.t.toast("ФИО должно быть не менее 3х букв","error")
    this.cartService.order().subscribe({
      next: (r: any) => {
        console.log(r);
        this.id = +r.response;
        this.cartService.cleanItems();
        this.items = this.cartService.getAll();
        this.openForm.emit(true);
      },
      error: (err) => {
        this.t.toast('Не удалось выполнить запрос.', 'error');
      },
    });
  }
}
