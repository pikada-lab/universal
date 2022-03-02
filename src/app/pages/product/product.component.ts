import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { CartService, UploadedFile } from 'src/app/business/cart.service';
import { ProductService } from 'src/app/business/product.service';
import { CartItem, Products } from 'src/app/models';
import { ToastService } from 'src/app/toast.service';
import { Meta } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { forkJoin } from 'rxjs';

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

  @ViewChild('file', { static: true })
  customeFile!: ElementRef<HTMLInputElement>;

  cases: Products[] = [];
  img!: SafeUrl;
  category?: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private t: ToastService,
    private ssd: DomSanitizer,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.productService.getProductByCategory(377).subscribe((r) => {
      this.cases = r.sort((a,b) => a.price - b.price);
    });

    if(typeof window == "object") {
      window.document.body.scrollTop = 0; 
    }

    this.route.params.subscribe((params: Params) => {
      if(typeof window == "object") {
         window.document.body.scrollTop = 0; 
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
        this.cartService.save();
      } else {
        this.cartService.add(
          this.product,
          r,
          +this.caseId,
          false,
          this.product.price,
          0
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
        console.log(this.customeFile.nativeElement);
        if (item) {
          item.customDescription = this.customDescription;
          this.customDescriptionFileUploaded = item.customDescriptionFile;
          item.qtty = qtty;
        } else {
          item = this.cartService.add(
            this.product,
            qtty,
            +this.caseId,
            true,
            this.product.price,
            0
          );
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

  private initProduct() {

    this.titleService.setTitle(this.product!.title ?? "Аптечка на заказ"); 
    this.meta.updateTag({name: "description", content: this.product!.subtitle ?? "Медицинская укладка"}); 
    this.img = this.ssd.bypassSecurityTrustUrl(this.product!.originalImg);
    console.log(this.product);
    this.caseId = this.product!.defaultCase;
    if (this.platformId == 'browser') {
      let item = this.cartService.get(this.product!, false);
      let itemSpecial = this.cartService.get(this.product!, true);
      this.isOnCart = false;
      this.isOnCartSpecial = false;
      if (item) {
        this.count = item.qtty;
        this.caseId = item.caseId; 
        console.log('CASE:', this.caseId);
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
  }

  changeCaseId(caseId: number) {
    if(this.caseId == caseId) return;
    this.caseId = caseId;
    console.log(this.caseId);
    let box = this.cases.find((r) => r.id == this.caseId);
    this.saveCase();
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
    console.log(item);
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
    console.log(e);
    if (this.customDescription.length >= this.maxCustomDescription)
      this.t.toast(`Не больше ${this.maxCustomDescription} символов`);
  }
}
