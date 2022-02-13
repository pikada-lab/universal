import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart, CartItem, Products } from '../models';
import { ToastService } from '../toast.service';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  ttl: number;
  create_at: number;
  mustDelete: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
 
  private items: CartItem[] = [];
  private cart: Cart = new Cart();
  private host: string;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: string,
    private t: ToastService 
  ) {
    this.host = environment.host;
    console.log("Cart",platformId);
    if (platformId == 'browser') {
      this.load();
      setInterval(() => {
        let d = Date.now();
        this.items.forEach((item) => {
          for (let r of item.customDescriptionFile) {
            r.mustDelete =
              r.create_at +
              r.ttl -
              d +
              new Date().getTimezoneOffset() * 60 * 1000; 
            if (r.create_at + r.ttl < d) {
              let index = item.customDescriptionFile.findIndex(
                (j) => j.id == r.id
              );
              if (!~index) continue;
              item.customDescriptionFile.splice(index, 1);
              this.save();
            }
          }
        });

        for (let r of this.cart.customDescriptionFile) {
          r.mustDelete =
            r.create_at +
            r.ttl -
            d +
            new Date().getTimezoneOffset() * 60 * 1000; 
          if (r.create_at + r.ttl < d) {
            let index = this.cart.customDescriptionFile.findIndex(
              (j) => j.id == r.id
            );
            if (!~index) continue;
            this.cart.customDescriptionFile.splice(index, 1);
            this.save();
          }
        }
      }, 1000);
    }
  }

  calc(): number {
    return this.items
      .filter((r) => !r.special)
      .map((r) => r.qtty * (r.price + r.priceCase))
      .reduce((acc, el) => acc + el, 0);
  }
  getMetadata() {
    return this.cart;
  }
  has(product: Products, special: boolean) {
    return !!~this.getIndexProduct(product, special);
  }

  get(product: Products, special: boolean) {
    if (!this.has(product, special)) return undefined;
    let index = this.getIndexProduct(product, special);
    return this.items[index];
  }

  add(
    product: Products,
    qtty: number,
    caseId: number,
    special: boolean,
    price: number,
    priceCase: number
  ) {
    if (this.has(product, special)) throw new Error('Уже в корзине');
    let item = new CartItem(
      product.id, qtty,
      caseId, special,
      price, priceCase
    );
    this.items.push(item);
    this.save();
    return item;
  }

  remove(product: CartItem) {
    let index = this.items.findIndex((el) => el == product);
    let items = this.items.splice(index, 1);
    this.removeItems(items);
    this.save();
  }

  clear() {
    this.removeItems(this.items);
    this.items = [];
    this.save();
  }

  cleanItems() {
    this.items = [];
    this.save();
  }

  private async removeItems(item: CartItem[]) {
    for (let i of item) {
      for (let f of i.customDescriptionFile) {
        this.deleteFileInItem(i, f.id).then((r) => {
          this.t.toast('Удалён файл ' + f.name);
        });
      }
    }
  }

  getAll() {
    return this.items;
  }

  private getIndexProduct(product: Products, special: boolean) {
    return this.items.findIndex(
      (el) => el.productId === product.id && el.special === special
    );
  }

  async uploadFile(customDescriptionFile: FileList): Promise<UploadedFile[]> {
    console.log(customDescriptionFile);
    if (!customDescriptionFile?.length) return [];
    let fd = new FormData();
    for (let i = 0; i < customDescriptionFile.length; i++) {
      let file = customDescriptionFile.item(i);
      if (file === null) continue;
      fd.append('customer-file', file, file.name);
    }
    return await firstValueFrom(
      this.http.post<UploadedFile[]>(this.host + '/api/files', fd)
    );
  }
  async deleteFile(product: Products, fileId: string) {
    let item = this.get(product, true);
    if (!item) return;
    await this.deleteFileInItem(item, fileId);
  }

  async deleteFileCart(fileId: string) {
    let fileIndex = this.cart.customDescriptionFile.findIndex(
      (r) => r.id === fileId
    );
    if (!~fileIndex) return;
    await firstValueFrom(this.http.delete(this.host + '/api/files/' + fileId));
    this.cart.customDescriptionFile.splice(fileIndex, 1);
    this.save();
  }

  private async deleteFileInItem(item: CartItem, fileId: string) {
    let fileIndex = item.customDescriptionFile.findIndex(
      (r) => r.id === fileId
    );
    if (!~fileIndex) return;
    await firstValueFrom(this.http.delete(this.host + '/api/files/' + fileId));
    item.customDescriptionFile.splice(fileIndex, 1);
    this.save();
  }

  save() {
    if (typeof window == 'object') {
      localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  load() {
    if (typeof window == 'object') {
      const items = localStorage.getItem('items');
      if (items) {
        this.items = JSON.parse(items);
      }
      const cart = localStorage.getItem('cart');
      if (cart) {
        this.cart = JSON.parse(cart);
      }
    }
  }

  getIcon(
    type:
      | 'text/plain'
      | 'application/vnd.oasis.opendocument.text'
      | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      | 'application/pdf'
      | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      | string
  ): string {
    switch (type) {
      case 'text/plain':
        return 'fa-solid fa-file';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.oasis.opendocument.text':
        return 'fa-solid fa-file-word';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'fa-solid fa-file-excel';
      case 'application/pdf':
        return 'fa-solid fa-file-pdf';
      default:
        return 'fa-solid fa-file';
    }
  }

  order() {
     let ref = {
       cart: this.cart,
       items: this.items,
     }
    return this.http.post(this.host + "/api/order", ref) 
  }

  sendRequest() {
    let ref = {
      cart: this.cart,
      items: [],
    };
    return this.http.post<number>(this.host + "/api/order/request", ref) 
  }

  sendCallRequest() {
    let ref = {
      cart: this.cart,
      items: [],
    };
    return this.http.post<number>(this.host + "/api/order/call", ref) 
  }

}
