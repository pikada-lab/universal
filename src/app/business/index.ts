import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Clients, Products } from "../models";

export const ProductService = new InjectionToken<ProductService>("ProductService")
export interface ProductService {
  getCategory(): Observable<any[]>;
  getCategoryByID(id: number): Observable<any>;

  getProductByCategory(id: number): Observable<Products[]>
  getProductById(id: number): Observable<Products>;
  getPopular(): Observable<Products[]>;
  search(q: any): Observable<Products[]>;
 
  getCompany(): Observable<Clients[]>;
}