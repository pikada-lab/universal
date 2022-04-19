import { basename } from 'path';
import { environment } from 'src/environments/environment';
import { Category, CategoryLike } from './Category';
import { DownloadApi } from './DownloadApi';
import { UniversalProduct } from './ProductAdapter';
const webp = require('webp-converter');
export class Yandex {
  TAB = '\t';
  EOL = '\n';
  fileContent = '';
  name = 'Aptechki.ru';
  url = 'https://aptechki.ru';
  constructor(
    private products: UniversalProduct[],
    private cases: UniversalProduct[],
    private categories: Category[]
  ) {}

  private addTag(name: string, content: string, tabs: number) {
    return this.tabs(tabs) + `<${name}>${content}</${name}>` + this.EOL;
  }
  private tabs(tabs: number) {
    return this.TAB.repeat(tabs);
  }

  private addShop(content: string) {
    return this.addTag('shop', content, 0);
  }

  private addCategory(category: CategoryLike, tabs: number) {
    return (
      this.tabs(tabs) +
      `<category id="${category.categoryID}">${category.name}</category>`
    );
  }

  private addDeliveryOptions(tabs: number) {
    return this.addTag(
      'delivery-options',
      this.TAB.repeat(tabs + 1) + `<option cost="600" days="15"/>` + this.EOL,
      tabs
    );
  }

  private addslashes(string: string) {
    return string
      .replace(/(\")/g, '&quot;')
      .replace(/(\')/g, '&apos;')
      .replace(/(\>)/g, '&gt;')
      .replace(/(\<)/g, '&lt;')
      .replace(/(\&)/g, '&amp;');
  }
  private addOffer(
    product: UniversalProduct,
    box: UniversalProduct | undefined,
    tabs: number = 0
  ) {
    let title = this.addslashes(product.title);

    let offer = this.tabs(tabs) + `<offer id="${product.id}">` + this.EOL;
    if (box) {
      let titleBox = this.addslashes(box.title);
      offer += this.addTag('name', title + '. В кейсе: ' + titleBox, tabs + 1);
      offer += this.addTag(
        'url',
        `${environment.host}products/${product.id}?box=${box.id}`,
        tabs + 1
      );
      offer += this.addTag(
        'price',
        (product.regularPrice / 100 + box.regularPrice / 100).toString(),
        tabs + 1
      );
      offer += this.addTag(
        'picture',
        this.makePicture(
          box.image.getImageURLs()?.[0]?.original ??
            'https://aptechki.ru/storage/original/17486.webp',
          box.image.getImageURLs()?.[0]?.id
        ),
        tabs + 1
      );
    } else {
      offer += this.addTag('name', title, tabs + 1);
      offer += this.addTag(
        'url',
        `${environment.host}products/${product.id}`,
        tabs + 1
      );
      offer += this.addTag(
        'price',
        (product.regularPrice / 100).toString(),
        tabs + 1
      ); 
      offer += this.addTag(
        'picture',
        this.makePicture(
          product.image.getImageURLs()?.[0]?.original ??
            'https://aptechki.ru/storage/original/17486.webp',
          product.image.getImageURLs()?.[0]?.id
        ),
        tabs + 1
      );
    }
    offer += this.addTag('currencyId', 'RUR', tabs + 1);
    offer += this.addTag('categoryId', product.categoryID.toString(), tabs + 1);
    offer += this.addTag(
      'description',
      this.makeDescription(product.description),
      tabs + 1
    );
    offer += this.addTag('delivery', 'true', tabs + 1);
    offer += this.addTag(
      'delivery-options',
      `<option cost="600" days="15" order-before="18"/>`,
      tabs + 1
    );
    offer += this.tabs(tabs) + '</offer>' + this.EOL;
    return offer;
  }

  private makePicture(urlPic: string, id: number) {
    let urlFile = new URL(urlPic);
    let urlBefore =
      'assets/' + basename(urlFile.pathname).replace('webp', 'png');
    DownloadApi(urlPic, './dist/browser/' + urlBefore).then((response: any) => {
      console.log(response);
    });
    return 'https://aptechki.ru/' + urlBefore;
  }

  private makeDescription(text: string) {
    const firstQuote = text.split(/\n/)?.[0]?.slice(0, 300) ?? '';
    return firstQuote;
  }

  private getHeader(products: UniversalProduct[], boxes: UniversalProduct[]) {
    let dateMax = 0;
    for (let prod of products) {
      if (prod.updatedAt < dateMax) continue;
      dateMax = prod.updatedAt;
    }
    for (let prod of boxes) {
      if (prod.updatedAt < dateMax) continue;
      dateMax = prod.updatedAt;
    }
    let date = new Date(dateMax).toJSON().replace(/\dZ/, '+03:00');
    let head = '<?xml version="1.0" encoding="UTF-8"?>' + this.EOL;
    head += '<yml_catalog date="' + date + '">' + this.EOL;
    return head;
  }

  private getCategories(categories: CategoryLike[]) {
    let file = this.tabs(1) + '<categories>' + this.EOL;
    for (let category of categories) {
      file += this.addCategory(category, 2);
    }
    file += this.tabs(1) + '</categories>' + this.EOL;
    return file;
  }
  private getOffers() {
    let offers = '';
    for (let product of this.products) {
      if (product.exclude) continue;
      if (product.type === 'AID') {
        for (let boxId of product.aidDetails!.getCases()) {
          let box = this.cases.find((r) => r.id === boxId)!;
          offers += this.addOffer(product, box, 2);
        }
      } else {
        offers += this.addOffer(product, undefined, 2);
      }
    }
    return this.addTag('offers', offers, 1);
  }
  build() {
    let file = this.getHeader(this.products, this.cases);
    let name = this.addTag('name', this.name, 1);
    let url = this.addTag('url', this.url, 1);
    let currencies = this.addTag(
      'currencies',
      this.tabs(2) + `<currency id="RUR" rate="1"/>` + this.EOL,
      1
    );
    let categories = this.getCategories(this.categories);
    let deliveryOptions = this.addDeliveryOptions(1);
    let offers = this.getOffers();

    return (
      file +
      this.addShop(
        name + url + currencies + categories + deliveryOptions + offers
      ) +
      '</yml_catalog>'
    );
  }
}
