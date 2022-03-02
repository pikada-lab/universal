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

  initState(product: UniversalProduct) {
    this.id = product.id;
    this.title = product.title;
    let splitText = product.description.split('\n');
    this.subtitle = splitText.shift() ?? '';
    this.text = splitText.join('\n') ?? '';
    this.isNew = product.latest;
    this.isTheBest = product.theBest;
    this.price = product.regularPrice;
    this.img =
      product.image.getImageURLs()?.[0]?.src ??
      'http://v2.farmprofi.ru/assets/box.png';
    this.originalImg =
      product.image.getImageURLs()?.[0]?.original ??
      'http://v2.farmprofi.ru/assets/box.png';
    this.type = product.type;
    if (product.type == 'AID') {
      this.aid = new AidDetails();
      this.aid.init(product.aidDetails);
    }
    this.categoryID = +product.categoryID;
    return this;
  }

  initStracture(product: Products): Products {
    this.id = product.id;
    this.title = product.title; 
    this.subtitle = product.subtitle;
    this.text = product.text;
    this.isNew = product.isNew;
    this.isTheBest = product.isTheBest;
    this.price = product.price;
    this.img = product.img; 
    this.originalImg = product.originalImg; 
    this.type = product.type;
    this.categoryID = product.categoryID;
    if (product.type == 'AID') {
      this.aid = new AidDetails();
      this.aid.init(product.aid);
    }
    return this;
  }
  hasCase(id: number) {
    if(this.type != "AID") return false;
    return this.aid?.hasCase(id);
  }

  get defaultCase(): number { 
    if(this.type != "AID") return -1;
    return this.aid?.getDefault() ?? -1;
  }
}
