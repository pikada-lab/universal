import { Inject, Injectable } from '@angular/core';
import { ProductAdapter, UniversalProduct } from 'adapters/ProductAdapter';
import { ProductRepository } from 'adapters/ProductRepository';
import { CompanyRepository } from 'adapters/CompanyRepository';
import { map, NEVER, Observable, of, tap } from 'rxjs'; 
import { ProductService } from '.';
import { Clients, Products } from '../models';

@Injectable()
export class ServerProductService implements ProductService {
  storage: Map<number, Products> = new Map();
  storageCateogryResponse: Map<number, Products[]> = new Map();
  constructor(
    @Inject('ProductRepository') private repo: ProductRepository,
    @Inject('CompanyRepository') private compony: CompanyRepository
    ) {}

  getCategory() {
    return of(this.repo.getAllCategories());
  }
  getCategoryByID(id: number) {
    return of(this.repo.getCategoryAidByID(id));
  }
  getProductByCategory(id: number): Observable<Products[]> {
    // console.time('[S] ProductService::getProductByCategory(' + id + ')');
    return of(this.repo.getProductByCategory(id)).pipe(
      map((products: UniversalProduct[]) => this.ProductRestore(products)),
      tap({
        next: () => {
          // console.timeEnd('[S] ProductService::getProductByCategory(' + id + ')');
        },
      })
    );
  }
  get hash() {
    return Math.round(Math.random() * 99999999).toString(16);
  }
  getProductById(id: number): Observable<Products> {
    const hash = this.hash;
    // console.time('[S] ProductService::getProductById(' + id + ')#' + hash);
    return of(this.repo.getProductByID(id)!).pipe(
      map((r: UniversalProduct) => {
        // console.timeEnd('[S] ProductService::getProductById(' + id + ')#' + hash);
        let product = new Products().initStracture(ProductAdapter(r));
        return product;
      })
    );
  }

  getPopular() {
    // console.time('[S] ProductService::getPopular()');
    return of(this.repo.getPopular()).pipe(
      map((products: UniversalProduct[]) => this.ProductRestore(products)),
      tap({
        next: () => {
          // console.timeEnd('[S] ProductService::getPopular()');
        },
      })
    );
  }
  search(q: any) { 
    return NEVER;
  }
  getCompany(): Observable<Clients[]> {
    return of(this.compony.getAllCompany());
  }

  private ProductRestore(products: UniversalProduct[]): Products[] {
    let productsResult: Products[] = [];
    for (let r of products) {
      if (r.exclude) continue;
      let product = new Products().initStracture(ProductAdapter(r));
      productsResult.push(product);
    }
    return productsResult;
  }
}
