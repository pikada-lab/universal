import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductService } from '.';
import { Clients, Products } from '../models';

@Injectable( )
export class ClientProductService implements ProductService {
  storage: Map<number, Products> = new Map();
  host: string;
  storageCateogryResponse: Map<number, Products[]> = new Map(); 
  constructor(
    private http: HttpClient, 
  ) {
    this.host = environment.host; 
  }

  getCategory() { 
    return this.http.get<any[]>(this.host + '/v2/category');
  }
  getCategoryByID(id: number) {
    return this.http.get<any[]>(this.host + '/v2/category?id=' + id);
  }
  getProductByCategory(id: number): Observable<Products[]> {
    
    // console.time('ProductService::getProductByCategory(' + id + ')');
    return this.http.get<Products[]>(this.host + '/v2/category/' + id).pipe(
      map((products: Products[]) => this.ProductRestore(products)),
      tap({
        next: () => {
          // console.timeEnd('ProductService::getProductByCategory(' + id + ')');
        },
      })
    );
  }
  get hash() {
    return Math.round(Math.random() * 99999999).toString(16);
  }
  getProductById(id: number): Observable<Products> { 
    const hash = this.hash;
    // console.time('ProductService::getProductById(' + id + ')#' + hash);
    return this.http.get<Products>(this.host + '/v2/product/' + id).pipe(
      map((r: Products) => {
        // console.timeEnd('ProductService::getProductById(' + id + ')#' + hash);
        let product = new Products().initStracture(r);
        return product;
      })
    );
  }

  getPopular() {
    // console.time('ProductService::getPopular()');
    return this.http.get<Products[]>(this.host + '/v2/product/popular').pipe(
      map((products: Products[]) => this.ProductRestore(products)),
      tap({
        next: () => {
          // console.timeEnd('ProductService::getPopular()');
        },
      })
    );
  }
  search(q: any) {
    // console.time('ProductService::search(' + q + ')');
    return this.http
      .get<Products[]>(this.host + '/api/product/search?q=' + encodeURI(q))
      .pipe(
        map((products: Products[]) => this.ProductRestore(products)),
        tap({
          next: () => {
            // console.timeEnd('ProductService::search(' + q + ')');
          },
        })
      );
  }

  getCompany() { 
    return this.http.get<Clients[]>(this.host + "/api/company/");
  }

  private ProductRestore(products: Products[]): Products[] {
    let productsResult: Products[] = [];
    for (let r of products) {
      if (r.exclude) continue;
      let product = new Products().initStracture(r);
      productsResult.push(product);
    }
    return productsResult;
  }
}
