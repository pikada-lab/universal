import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from '../pages/cart/cart.component';
import { ClientsComponent } from '../pages/clients/clients.component';
import { ContactsComponent } from '../pages/contacts/contacts.component';
import { HomeComponent } from '../pages/home/home.component';
import { ProductComponent } from '../pages/product/product.component';
import { ProductsComponent } from '../pages/products/products.component';

const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'cart', component: CartPageComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full',}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
