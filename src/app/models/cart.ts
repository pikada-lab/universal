import { UploadedFile } from "../business/cart.service";

export enum PaymentType {
  CASH = 1,
  UNCASH,
}

export enum DeliveryType {
  SELF = 1,
  COURIER,
  COURIER_MKAD,
}

export class Cart {
  id: number = -1;
  name: string = "";
  phone: string = "";
  mail: string = "";
  address: string = "";
  paymentType: PaymentType = 1;
  deliveryType: DeliveryType = 1;
  comment?: string;
  requisites?: string;
  customDescriptionFile: UploadedFile[] = [];

  get delivery() {
    return this.deliveryType.toString();
  }
  set delivery(s: string) {
    this.deliveryType = +s;
  }

  get payment() {
    return this.paymentType.toString();
  }
  set payment(s: string) {
    this.paymentType = +s;
  }
}

export class CartItem { 
  cartId!: number;
  /** Дата добавления в корзину */
  datePut: number = +new Date();
  productId!: number;
  special: boolean;
  customDescriptionFile: UploadedFile[] = [];
  customDescription?: string;
  qtty!: number;
  caseId!: number;
  price: number = 0;
  priceCase: number  = 0;
  constructor(
      productId: number, 
      qtty: number, 
      caseId: number, 
      special?: boolean,
      price?: number,
      priceCase?: number 
    ) {
    this.productId = productId;
    this.qtty = qtty;
    this.price = price ?? 0;
    this.priceCase = priceCase ?? 0;
    this.caseId = caseId;
    this.special = special ?? false;
  }
 
}
