import { Cart, CartItem } from 'src/app/models';
import ICQ from 'icq-bot';
import { ProductAdapter } from './ProductAdapter';
import { ICQHttpClient } from 'HttpClient';
import { UploadedFile } from 'src/app/business/cart.service';
import { extname } from 'path'; 
import { Connection, createConnection, OkPacket } from 'mysql2/promise';
 

async function openConnection() {
  const connection = await createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saq33rrT',
    database: 'cito3_aptechki',
  });
  await connection.beginTransaction()
  return connection;
} 

async function commit(connection: Connection) {
  await connection.commit()
  await connection.end()
  connection.destroy();
}

async function rollback(connection: Connection) {
  await connection.rollback()
  await connection.end()
  connection.destroy();
}
 
async function saveOrder(connection: Connection, cart: Cart): Promise<number> {
  const [results, field ] = await connection.query<OkPacket>(
      'INSERT INTO `orderv2`(`id`, `name`, `phone`, `mail`, `address`, `comment`, `status`, `date`, `delivery`, `payment`, `custormerFiles`) VALUES ' +
       `(NULL, ?, ?, ?, ?, ?, 0, NOW(), ?, ?, ?)`,
       [cart.name, cart.phone, cart.mail, cart.address ?? '', cart.comment ?? '',   cart.deliveryType,  cart.paymentType, cart.customDescriptionFile.join()] ); 
       cart.id = results.insertId;
  
  return results.insertId; 
}


async function saveOrderItem(connection: Connection, order_id: number, item: CartItem) {
   
  const [results, field ]  = await connection.query<OkPacket>(
    "INSERT INTO `orderv2_items`(`id`, `product_id`, `price`, `boxing_id`, `priceCase`, `qtty`, `special`, `customDescription`, `customDescriptionFile`, `order_id`, `STATUS`) VALUES " +
    `(NULL, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [item.productId, item.price, item.caseId, item.priceCase, item.qtty, item.special, item.customDescription ?? '', JSON.stringify(item.customDescriptionFile), order_id, "CREATED"]);
    console.log(item);
    return results.insertId;
  }

export class Order {
  private bot: any;
  private http = new ICQHttpClient();
  private recipient = '@dzhigurda';
  private cart: Cart;
  private items: CartItem[];

  constructor(body: any, private uploadPath: string) {
    this.bot = new ICQ.Bot('001.1188664136.0582363194:751224051');
    this.cart = body.cart;
    this.items = body.items ?? [];
  }

  private buildOrderCart() {
    return [
      '*Заказ номер ' + this.cart.id + '*',
      `- _${this.cart.name}_`,
      `- ${this.cart.phone}`,
      `- ${this.cart.address}`,
      `- ${this.getPaymentText()}`,
      `- ${this.getDeliveryText()}`,
      '```\n' + this.cart.comment + '```',
      this.cart.mail,
    ].join('\n');
  }
  private buildOrderCallCart() {
    return [
      '*Перезвонить по телефону, номер заявки: ' + this.cart.id + '*',
      `- _${this.cart.name}_`,
      `- ${this.cart.phone}`,
    ].join('\n');
  }
  private buildOrderRequestCart() {
    return [
      '*Отправлен запрос, номер заявки: ' + this.cart.id + '*',
      `- _${this.cart.name}_`,
      `- ${this.cart.phone}`,
      this.cart.mail,
    ].join('\n');
  }
  private getPaymentText() {
    switch (+this.cart.paymentType) {
      case 1:
        return 'Безналичный расчёт';
      default:
        return 'Наличный расчёт';
    }
  }

  private getDeliveryText() {
    switch (+this.cart.deliveryType) {
      case 1:
        return 'Самовывоз';
      case 2:
        return 'Доаставка курьером';
      default:
        return 'Доставка курьером за МКАД';
    }
  }
  private buildButtons(array: any[]) {
    let buttons = array.map(
      (file: any) =>
        new ICQ.Button(
          'Скачать ' + file.name,
          'No metter',
          'http://localhost:4201/api/files/' + file.id
        )
    );
    if (buttons.length == 0) return undefined;
    return buttons;
  }

  async sendMessage(text: string, button: any) {
    return new Promise((res, rej) => {
      this.bot
        .sendText(
          this.recipient,
          text,
          undefined,
          undefined,
          undefined,
          button,
          { mode: 'MarkdownV2' }
        )
        .then((r: any) => {
          console.log(r);
          res(r);
        });
    });
  }
  async sendFile(file: UploadedFile) {
    return new Promise((res, rej) => {
      let fileLink = this.uploadPath + file.id + extname(file.name);
      this.bot
        .sendFile(this.recipient, '', fileLink, file.name)
        .then((r: any) => {
          console.log(r);
          res(r);
        });
    });
  }

  async getProductByID(id: number) {
    if(!id || id === -1) return null;
    let caseRef = await this.http.get<any>(
      'http://127.0.0.1:9001/v1/product/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    console.log(id, caseRef);
    return ProductAdapter(caseRef[0]);
  }

  private async sendItem(item: CartItem) {
    let text = await this.buildCartItem(item);
    let button = await this.buildButtons(item.customDescriptionFile);
    await this.sendMessage(text, button);
  }

  private async buildCartItem(item: CartItem) {
    const product = await this.getProductByID(item.productId);
    if(!product) throw new Error("Был заказан несуществующий товар");
    const box = await this.getProductByID(item.caseId);
    return (
      `*${product.title}* - ${product.subtitle.substring(0, 50)}...\n` +
      (box ? `Упакован в *${box.title}*\n` : `Упаковка не выбрана\n`) +
      `Цена: ${item.price / 100}  + кейс: ${item.priceCase / 100} = ${
        (item.price / 100) + (item.priceCase / 100)
      } Руб. x ${item.qtty} Шт.\n` +
      `Специальный: _${item.special ? 'Да' : 'Нет'} Заказ номер ${
        this.cart.id
      }_\n` +
      this.getDescription(item)
    );
  }

  private getDescription(item: CartItem) {
    if (!item.special) return '';
    return '*Состав аптечки*\n' + item.customDescription;
  }

  async send(): Promise<number> { 
    // TODO ID 
    const connect = await openConnection();
    try { 
      let id = await saveOrder(connect, this.cart);  
      for(let item of this.items) {
        await saveOrderItem(connect, id, item );
      } 
      const text = this.buildOrderCart();
      const button = this.buildButtons(this.cart.customDescriptionFile);
      await this.sendMessage(text, button);
      for (let f of this.cart.customDescriptionFile) {
        await this.sendFile(f);
      }
      for (let item of this.items) {
        await this.sendItem(item);
      }
      await commit(connect);
      return id;
    } catch(ex) {
      console.log(ex);
      await rollback(connect);
    }
    throw new Error("Не удалось создать заказ");
  }
  async sendCall() {
    const id = Math.round(Math.random() * 999);
    this.cart.id = id;
    const text = this.buildOrderCallCart();
    await this.sendMessage(text, undefined);
    return id;
  }
  async sendRequest() {
    const id = Math.round(Math.random() * 999);
    this.cart.id = id;
    const text = this.buildOrderRequestCart();
    await this.sendMessage(text, undefined);
    return id;
  }
}
