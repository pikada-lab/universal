import { Products } from "src/app/models";
import { AidDetails } from "src/app/models/AidDetails";

 

export type ProductTypes = "DEFAULT" | "AID";
  export type ProductStatus =
  | "PENDING"
  | "CREATED"
  | "PENDING_CHECK"
  | "SUCCESS"
  | "DELETED"
  | "EDIT";

export class UniversalProduct {
  public id: number;

  public sku!: number;

  public title: string = "";
  public description: string = "";
  public keywords: string = "";
  public descriptionType: "HTML" | "MARKDOWN" | "TEXT" = "HTML";

  public regularPrice: number = 0;
  public categoryID: number = 0;

  public gnvls: boolean = false;
  public prescription: boolean = false;
  public issue: boolean = false;
  public exclude: boolean = false;
  public rare: boolean = false;
  public theBest: boolean = false;
  public latest: boolean = false;

  public type: ProductTypes = "DEFAULT";
  public aidDetails: AidDetails | undefined;

  public userID: number | null = null;

  public STATUS: ProductStatus = "PENDING";

  public image: ImageList;

  public updatedAt: number;

  constructor(id: number) {
    this.id = id;
    this.updatedAt = +new Date();
    this.image = new ImageList();
  }

  getID() {
    return this.id;
  }

  getSKU() {
    return this.sku;
  }

  getTitle() {
    return this.title;
  }
  getStatus() {
    return this.STATUS;
  }
  initState(json: any) {
    this.sku = json.sku;
    this.title = json.title;
    this.description = json.description;
    this.keywords = json.keywords;
    this.descriptionType = json.descriptionType,
    this.categoryID = json.categoryID;
    this.gnvls = json.gnvls;
    this.prescription = json.prescription;
    this.issue = json.issue;
    this.theBest = json.theBest;
    this.latest = json.latest;
    this.regularPrice = +json.regularPrice;
    this.exclude = json.exclude;
    this.userID = json.userID;
    this.STATUS = json.STATUS;
    this.type = json.type;
    if(json.type === "AID") {
      this.aidDetails = new AidDetails();
      this.aidDetails.init(json.aidDetails);
    }
    json.image?.forEach((id: number, i: number) => {
      this.image.add(id, i);
    });
    this.updatedAt = json.updatedAt;
    return this;
  }
  toJSON() {
    return Object.assign({
      id: this.id,
      sku: this.sku,
      title: this.title,
      description: this.description,
      descriptionType: this.descriptionType,
      keywords: this.keywords,
      categoryID: this.categoryID,
      gnvls: this.gnvls,
      prescription: this.prescription,
      issue: this.issue, 
      theBest: this.theBest,
      latest: this.latest,
      regularPrice: this.regularPrice,
      exclude: this.exclude,
      userID: this.userID,
      STATUS: this.STATUS,
      image: this.image.getImages(),
      updatedAt: this.updatedAt,
    });
  }
}


/**
 * Список изображений
 */
 export class ImageList {
  private images: number[] = [];
  private thumbnail: { id: number; src: string, original: string }[] = [];
  get count() {
    return this.images.length;
  }
  getImageURLs() {
    return this.thumbnail;
  }

  getImages() {
    return this.images;
  }

  add(resource: number, order?: number) {
    if (this.images.includes(resource)) return;
    this.images.splice(order ?? 0, 0, resource);
    this.thumbnail.splice(order ?? 0, 0, {
      id: resource,
      src: `http://auxilium-system.ru/storage/enlarged/${resource}.webp`,
      original: `http://auxilium-system.ru/storage/original/${resource}.webp`,
    });
  }

  has(resource: number) {
    return !!~this.getIndex(resource);
  }

  delete(resource: number) {
    const index = this.getIndex(resource);
    if (~index) {
      this.images.splice(index, 1);
      this.thumbnail.splice(index, 1);
    }
  }

  resort(resources: number[]) {
    const tmp: number[] = [];
    for (let i of resources) {
      if (this.images.includes(i)) tmp.push(i);
    }
    this.images.splice(0, tmp.length, ...tmp);
    this.thumbnail.splice(
      0,
      tmp.length,
      ...tmp.map((r) => ({
        id: r,
        src: `http://auxilium-system.ru/storage/enlarged/${r}.webp`,
        original: `http://auxilium-system.ru/storage/original/${r}.webp`,
      }))
    );
  }

  private getIndex(resource: number): number {
    return this.images.findIndex((r: number) => r == resource);
  }
}


export function ProductAdapter(product: UniversalProduct): Products {
  let productRef = new UniversalProduct(product.id).initState(product);
  return new Products().initState(productRef);
}