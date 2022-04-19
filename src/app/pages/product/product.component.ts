import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit, 
  PLATFORM_ID, 
  Optional,
  ViewChild,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { CartService, UploadedFile } from 'src/app/business/cart.service';
 
import { CartItem, Products } from 'src/app/models';
import { ToastService } from 'src/app/toast.service';
import { Meta } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { forkJoin } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens'; 
import { Request } from 'express';
import { ProductService } from 'src/app/business';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.css',
    './product-header.css',
    './boxing.css',
  ],
})
export class ProductComponent implements OnInit { 
  public count: number = 1;
  public product: Products | undefined;
  public caseId = 53385;
  public isOnCart = false;

  public countSpecial: number = 1;
  public isOnCartSpecial = false;

  public customDescription: string = '';
  public customDescriptionFile: string = '';
  public customDescriptionFileUploaded: UploadedFile[] = [];

  public remove = new EventEmitter<void>();
  public order = new EventEmitter<number>();

  public removeSpecial = new EventEmitter<void>();
  public orderSpecial = new EventEmitter<number>();

  @ViewChild('file', { static: false }) 
  customeFile!: ElementRef<HTMLInputElement>;

  cases: Products[] = [];
  img!: SafeUrl;
  category?: any;

  loading = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: any,
    @Optional() @Inject(REQUEST) private request: Request,
    @Inject(ProductService) private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private t: ToastService,
    private ssd: DomSanitizer,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getProductByCategory(377).subscribe((r) => {
      this.cases = r.sort((a,b) => a.price - b.price);
    });

    if(typeof window == "object") {
      this.document.body.scrollTop = 0; 
    }

    this.route.params.subscribe((params: Params) => {
      this.updateCanonical(params['id']); 
      if(typeof window == "object") {
        this.document.body.scrollTop = 0; 
      }
      forkJoin( [
        this.productService.getProductByCategory(377),
        this.productService.getProductById(params['id']), 
      ]).subscribe(([cases, r]) => { 
        this.cases = cases.sort((a,b) => a.price - b.price);
        this.product = r as Products; 
        this.initProduct();

        this.productService.getCategoryByID(this.product.categoryID).subscribe((category: any) => {
          this.category = category;
          this.loading = false;
        })
      });
    });

    this.remove.subscribe(() => {
      if (!this.product) return this.t.toast('Товар удалён из корзины');
      let item = this.cartService.get(this.product, false);
      if (item) {
        this.cartService.remove(item);
        this.isOnCart = false;
      }
    });
    this.order.subscribe((r) => {
      if (!this.product) return this.t.toast('Нет товара');
      this.t.toast('Товар добавлен в корзину');
      let item = this.cartService.get(this.product, false);
      if (item) {
        item.qtty = r;
        item.caseId = +this.caseId;
        let box = this.cases.find(r => r.id == this.caseId);
        this.currentCase = box;
        this.cartService.save();
      } else {
        let box = this.cases.find(r => r.id == this.caseId);
        this.currentCase = box;
        this.cartService.add(
          this.product,
          r,
          +this.caseId,
          false,
          this.product.price,
          (box?.price ?? 0)
        );
        this.isOnCart = true;
      }
    });

    this.removeSpecial.subscribe(() => {
      if (!this.product) return this.t.toast('Нет товара');
      this.t.toast('Товар с описью удалён из корзины');
      let item = this.cartService.get(this.product, true);
      if (item) {
        this.cartService.remove(item);
        this.customDescription = '';
        this.isOnCartSpecial = false;
      }
    });
    this.orderSpecial.subscribe(async (qtty: number) => {
      if (!this.product) return this.t.toast('Нет товара', 'error');
      try {
        let item = this.cartService.get(this.product, true); 
        if (item) {
          item.customDescription = this.customDescription;
          this.customDescriptionFileUploaded = item.customDescriptionFile;
          item.qtty = qtty;
        } else {
          item = this.cartService.add(this.product, qtty, +this.caseId, true, this.product.price, 0);
          item.customDescription = this.customDescription;
          this.customDescriptionFileUploaded = item.customDescriptionFile;
          this.isOnCartSpecial = true;
        } 
        await this.saveFiles(item);
        this.cartService.save();
        this.t.toast('Товар с описью добавлен в корзину');
      } catch (ex: any) {
        this.t.toast(ex.message,'error');
      }
    });
  }


  private updateCanonical(id: any) {
    const canonicalUrl = "https://aptechki.ru/products/"+id ;
 
    if (this.platformId == 'browser') {
      const head = this.document.getElementsByTagName('head')[0];
      var element: HTMLLinkElement = this.document.querySelector(`link[rel='canonical']`) || null;
      if (element == null) {
        element = this.document.createElement('link') as HTMLLinkElement;
        head.appendChild(element);
      }
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', canonicalUrl);
    }
    
    if (isPlatformServer(this.platformId)) {
      if (this.request.res) {
        this.request.res.set("Link",`<${canonicalUrl}>; rel="canonical"`); 
      }
    }
    
    
  }

  private initProduct() { 
    this.titleService.setTitle(this.product!.title ?? "Аптечка на заказ"); 
    this.meta.updateTag({name: "description", content: this.product!.subtitle ?? "Медицинская укладка"});
    this.meta.updateTag({property: "og:title", content: this.product!.title ?? "Аптечка на заказ"});  
    this.meta.updateTag({property: "og:image", content: this.product!.originalImg ?? "https://aptechki.ru/assets/logo.apt2@2x.png"});  
    this.meta.updateTag({property: "og:description", content: this.product!.subtitle ?? "Медицинская укладка"});  
 
    this.img = this.ssd.bypassSecurityTrustUrl(this.product!.originalImg);  
    this.caseId =  this.route.snapshot.queryParams['box'] ?? this.product!.defaultCase;
 

    if (this.platformId == 'browser') {
      let item = this.cartService.get(this.product!, false);
      let itemSpecial = this.cartService.get(this.product!, true);
      this.isOnCart = false;
      this.isOnCartSpecial = false;
      if (item) {
        this.count = item.qtty;
        this.caseId = item.caseId; 
        this.isOnCart = true;
      }
      if (itemSpecial) {
        this.countSpecial = itemSpecial.qtty;
        this.customDescription = itemSpecial.customDescription ?? '';
        if (Array.isArray(itemSpecial.customDescriptionFile)) {
          this.customDescriptionFileUploaded =
            itemSpecial.customDescriptionFile;
        }
        this.isOnCartSpecial = true;
      }
      if(this.caseId != -1) {
        const caseAid = this.cases.find(pr => pr.id == this.caseId);
        if(caseAid) {
          this.img = this.ssd.bypassSecurityTrustUrl(caseAid!.originalImg);
        }
      }
    }
    let box = this.cases.find(r => r.id == this.caseId);
    this.currentCase = box;
  }


  currentCase?: Products;
  changeCaseId(caseId: number) {
    if(this.caseId == caseId) return;
    this.caseId = caseId; 
    let box = this.cases.find((r) => r.id == this.caseId);
    this.saveCase();
    this.currentCase = box;
    if (box) this.img = this.ssd.bypassSecurityTrustUrl(box.originalImg);
  }

  saveCase() {
    if (!this.product) return;
    let item = this.cartService.get(this.product, false);
    if (!item) return;
    item.caseId = +this.caseId;
    item.priceCase =
      this.cases?.find((r) => {
        return r.id == item?.caseId;
      })?.price ?? 0;
    this.cartService.save();
    this.t.toast('Упаковка изменена');
  }
  async saveFiles(item: CartItem) {
    try {
    item.customDescription = this.customDescription;
    if (this.customeFile.nativeElement.files) {
      let file = await this.cartService.uploadFile(
        this.customeFile.nativeElement.files
      );
      if (file) {
        item.customDescriptionFile.push(...file);
      }
    }
  } catch(ex: any) { 
    throw new Error("Не удалось загрузить файл, возможно он больше 8Мб");
  }
  }

  deleteFile(file: string) {
    if (!this.product) return this.t.toast('Нет товара');
    this.cartService.deleteFile(this.product, file);
  }

  getIcon(type: string) {
    return this.cartService.getIcon(type);
  }

  maxCustomDescription = 3000;
  alert(e: any) {
    if (this.customDescription.length >= this.maxCustomDescription)
      this.t.toast(`Не больше ${this.maxCustomDescription} символов`);
  }
}
