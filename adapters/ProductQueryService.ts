import { ProductAdapter } from "./ProductAdapter";
import { ProductRepository } from "./ProductRepository";

export class ProductQueryService {

  constructor(private repo: ProductRepository) {

  }
  
  //идея - соединить бокс и товар
  getProductByID(id: number) {
    const uproduct = this.repo.getProductByID(id);
    if(!uproduct) throw new Error("Нет товара номер "+id);
    const product = ProductAdapter(uproduct);
    const caseId = product.defaultCase ?? -1;
    if(caseId !== -1) {
      const box = this.repo.getProductByID(caseId);
      if(!box) throw new Error("Нет кейса номер "+caseId);
      product.setCase( ProductAdapter(box));
    } 
    return product;
  }
}