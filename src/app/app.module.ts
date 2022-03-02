import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './router/app-routing.module';

import { AppComponent } from './app.component';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BestComponent } from './blocks/best/best.component';
import { BoxingComponent } from './blocks/boxing/boxing.component';
import { CartComponent } from './blocks/cart/cart.component';
import { ClientsInsertComponent } from './blocks/clients-insert/clients-insert.component';
import { CounterComponent } from './blocks/counter/counter.component';
import { FooterComponent } from './blocks/footer/footer.component';
import { GreeterComponent } from './blocks/greeter/greeter.component';
import { HeaderComponent } from './blocks/header/header.component';
import { PopularComponent } from './blocks/popular/popular.component';
import { ProductCardComponent } from './blocks/product-card/product-card.component';
import { ProductHeaderComponent } from './blocks/product-header/product-header.component';
import { SearchFormComponent } from './blocks/search-form/search-form.component';
import { HomeComponent } from './pages/home/home.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { ChipsComponent } from './blocks/chips/chips.component';
import { ClientsCardComponent } from './blocks/clients-card/clients-card.component';
import { ClientBigCardComponent } from './blocks/client-big-card/client-big-card.component';
import { CartPageComponent } from './pages/cart/cart.component';
import { CartItemComponent } from './blocks/cart-item/cart-item.component';
import { NumberFor3Pipe } from './number-for-3.pipe';
import { MarkdownModule } from 'ngx-markdown';
import { BytesPipe } from './business/bytes.pipe';
import { ModalComponent } from './modal/modal.component';
import { AidBoxComponent } from './blocks/boxing/aid-box/aid-box.component';
import { ProcessComponent } from './blocks/process/process.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'aptechki' }),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    BestComponent,
    BoxingComponent,
    CartComponent,
    ClientsInsertComponent,
    CounterComponent,
    FooterComponent,
    GreeterComponent,
    HeaderComponent,
    PopularComponent,
    ProductCardComponent,
    ProductHeaderComponent,
    SearchFormComponent,
    HomeComponent,
    ClientsComponent,
    ContactsComponent,
    ProductsComponent,
    ProductComponent,
    ChipsComponent,
    ClientsCardComponent,
    ClientBigCardComponent,
    CartPageComponent,
    CartItemComponent,
    NumberFor3Pipe,
    BytesPipe,
    ModalComponent,
    AidBoxComponent,
    ProcessComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string
  ) {  
    const platform = isPlatformBrowser(platformId)
      ? 'in the browser'
      : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
