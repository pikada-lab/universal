import { UniversalProduct } from "adapters/ProductAdapter";

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

  text: string = "";

  descriptionFile?: string;
  ruleFile?: string;

  defaultCase: number = 1;

  initState(product: UniversalProduct) {
    this.id = product.id;
    this.title = product.title; 
    let splitText = product.description.split("\n")
    this.subtitle = splitText.shift() ?? "";
    this.text = splitText.join("\n") ?? "";
    this.isNew = product.latest;
    this.isTheBest = product.theBest;
    this.price = product.regularPrice;
    this.img = product.image.getImageURLs()?.[0]?.src ?? 'http://v2.farmprofi.ru/assets/box.png' 
    return this;
  }
}
