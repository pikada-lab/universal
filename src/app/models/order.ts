import { DeliveryType, PaymentType } from './cart';

export class Order {
  id: number;
  name: string;
  phone: string;
  mail: string;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  comment: string;
  requisites?: string;

  dateOrder: number;
  dateAccept?: number;
  dateCanceled?: number;
  dateDone?: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  /** Дата добавления в корзину */
  datePut: number;
  productId: number;
  customDescriptionFile: string;
  customDescription: string;
  qtty: number;
}
