import { ICQHttpClient } from 'HttpClient';
import { Category } from './Category';
import { UniversalProduct } from './ProductAdapter';

export class ProductRepository {
  private aptechkiCategory!: Category[];
  private productIndex = new Map<number, UniversalProduct>();
  private produt2categoryIndex = new Map<
    number,
    Map<number, UniversalProduct>
  >();
  private products: UniversalProduct[] = [];
  constructor(private http: ICQHttpClient) {}
  async init() {
    console.time('ceshes created');
    await this.prepare();
    console.timeEnd('ceshes created');
    setInterval(() => {
      this.prepare().then(() => {
        console.log('ceshes updated');
      });
    }, 1000 * 60 * 1);
  }
  async prepare() {
    this.productIndex.clear();
    this.produt2categoryIndex.clear();
    await this.preperCategoryAid();
    await this.preperCases();
    await this.preperAllProducts();
  }

  async preperCases() {
    const categoryId = 377;
    let productCat = await this.preperProductByCategory(377);
    this.makeIndex(productCat, categoryId);
  }
  async preperCategoryAid() {
    const categories = await this.http.get<any>(
      'http://127.0.0.1:9001/v1/category/',
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (categories.status != 0) {
      throw new Error('Временно не работает');
    }
    let aptechkiCategory = [];
    for (let i of categories.response) {
      if (i.parent == 374) {
        aptechkiCategory.push(new Category(i));
      }
    }
    this.aptechkiCategory = aptechkiCategory;
  }

  async preperAllProducts() {
    const category = this.getCategoryAid();
    let product = []; 
    for (let cat of category) {
      const categoryId = +cat.categoryID;
      let productCat = await this.preperProductByCategory(categoryId);
      product.push(...productCat);
      this.makeIndex(productCat, categoryId);
    }
    this.products = product;
  }

  private makeIndex(productCat: UniversalProduct[], categoryId: number) {
    if (!this.produt2categoryIndex.has(categoryId)) {
      this.produt2categoryIndex.set(categoryId, new Map());
    }
    productCat.forEach((element) => {
      this.productIndex.set(element.id, element);
      this.produt2categoryIndex.get(categoryId)!.set(element.id, element);
    });
  }

  async preperProductByCategory(id: number): Promise<UniversalProduct[]> {
    let result = await this.http.get<UniversalProduct[]>(
      'http://127.0.0.1:9001/v1/product/category/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (!result) result = [];
    return result.filter(p => !p.exclude).map((r) => new UniversalProduct(r.id).initState(r));
  }

  getCases() {
    return this.getProductByCategory(377);
  }
  getProductByID(id: number) {
    return this.productIndex.get(id);
  }

  getProductByCategory(id: number) {
    return Array.from(this.produt2categoryIndex.get(id)?.values() ?? []);
  }
  getCategoryAid() {
    return this.aptechkiCategory;
  }

  getAllProducts() {
    return this.products;
  }

  getAllCategories() {
    return this.aptechkiCategory;
  }
  getCategoryAidByID(id: number) {
    return this.getAllCategories().find((r) => r.categoryID == id);
  }
  getPopular(): UniversalProduct[] {
    return this.getAllProducts()
      .filter((r) => r.rare)
      .filter((r: any) => !r.exclude)
      .sort((r: any, l: any) => r.regularPrice - l.regularPrice);
  }
}
