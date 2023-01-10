import { UniversalProduct } from 'adapters/ProductAdapter';
import { AidDetails } from './AidDetails';

/**
 * Продукт
 */
export class Products {
  id!: number;
  title!: string;
  subtitle!: string;

  isNew: boolean = false;
  isTheBest: boolean = false;

  price: number = 0;
  img!: string;
  originalImg!: string;

  text: string = '';

  descriptionFile?: string;
  ruleFile?: string;

  aid: AidDetails | undefined;
  type!: string;

  categoryID!: number;
  exclude!: boolean;

  updateAt!: number;
  keywords!: string;
  initState(product: UniversalProduct) {
    if (!product?.id) throw new Error("Карточка товара пуста");
    this.id = product.id;
    this.title = product.title;
    let splitText = product.description.split('\n');
    this.subtitle = splitText.shift() ?? '';
    this.text = splitText.join('\n') ?? '';

    this.keywords = product.keywords;
    this.isNew = product.latest;
    this.isTheBest = product.theBest;
    this.price = product.regularPrice;
    this.img =
      product.image.getImageURLs()?.[0]?.src ??
      'https://aptechki.ru/assets/box.png';
    this.originalImg =
      product.image.getImageURLs()?.[0]?.original ??
      'https://aptechki.ru/assets/box.png';
    this.type = product.type;
    if (product.type == 'AID') {
      this.aid = new AidDetails();
      this.aid.init(product.aidDetails);
    }
    this.categoryID = +product.categoryID;
    this.exclude = product.exclude;
    this.updateAt = product.updatedAt;
    return this;
  }

  initStracture(product: Products): Products {
    this.id = product.id;
    this.title = product.title;
    this.subtitle = product.subtitle;
    this.keywords = product.keywords;
    this.text = product.text;
    this.isNew = product.isNew;
    this.isTheBest = product.isTheBest;
    this.price = product.price;
    this.img = product.img;
    this.originalImg = product.originalImg;
    this.type = product.type;
    this.categoryID = product.categoryID;
    this.exclude = product.exclude;
    this.updateAt = product.updateAt;
    if (product.type == 'AID') {
      this.aid = new AidDetails();
      this.aid.init(product.aid);
    }
    return this;
  }
  hasCase(id: number) {
    if (this.type != 'AID') return false;
    return this.aid?.hasCase(id);
  }

  get defaultCase(): number {
    if (this.type != 'AID') return -1;
    return this.aid?.getDefault() ?? -1;
  }


  get boxIsSet() {
    return !!this.box;
  }
  private box?: Products;
  setCase(box: Products) {
    this.box = box;
  }

  getCase() {
    return this.box;
  }
}
