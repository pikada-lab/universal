import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  storage: Map<number, Products> = new Map();
  host: string;
  storageCateogryResponse: Map<number, Products[]> = new Map();
  constructor(private http: HttpClient) { 
    this.host = environment.host;
  }

  getCategory() {
    return this.http.get<any[]>(this.host + '/api/category');
  }
  getCategoryByID(id: number) {
    return this.http.get<any[]>(this.host + '/api/category?id='+id);
  }
  getProductByCategory(id: number): Observable<Products[]> {
    if (!this.storageCateogryResponse.has(+id))
      return this.getProductByCategoryPipe(+id);
    this.getProductByCategoryPipe(+id).subscribe();
    return of(this.storageCateogryResponse.get(+id) as Products[]);
  }

  getProductByCategoryPipe(id: number) {
    return this.http.get<Products[]>(this.host + '/api/category/' + id).pipe(
      map((products: Products[]) => {
        let productResult: Products[] = [];
        for (let r of products) {
          let product = new Products().initStracture(r);
          this.storage.set(+r.id, product);
          productResult.push(product)
        }
        this.storageCateogryResponse.set(+id, productResult);
        return productResult;
      })
    );
  }
  getProductById(id: number): Observable<Products> {
    if (!this.storage.has(+id)) return this.getProductByIdPipe(+id);
    this.getProductByIdPipe(+id).subscribe(); 
    return of(this.storage.get(+id) as Products);
  }

  private getProductByIdPipe(id: number) {
    return this.http.get<Products>(this.host + '/api/product/' + id).pipe(
      map((r: Products) => {
        let product = new Products().initStracture(r);
        this.storage.set(+r.id, product);
        return product;
      })
    );
  }

  getPopular() {
    return this.http.get<Products[]>(this.host + '/api/product/popular').pipe(
      map((products: Products[]) => {
        let productsResult: Products[] = [];
        for (let r of products) {
          let product = new Products().initStracture(r);
          this.storage.set(+r.id, product);
          productsResult.push(product);
        }
        return productsResult;
      })
    );
  }
  search(q: any) {
    return this.http
      .get<Products[]>(this.host + '/api/product/search?q=' + encodeURI(q))
      .pipe(
        map((products: Products[]) => {
          let productsResult: Products[] = [];
          for (let r of products) {
            let product = new Products().initStracture(r);
            this.storage.set(+r.id, product);
            productsResult.push(product);
          }
          return productsResult;
        })
      );
  }
}
