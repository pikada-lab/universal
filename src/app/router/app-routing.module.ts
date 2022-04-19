import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from '../pages/cart/cart.component';
import { ClientsComponent } from '../pages/clients/clients.component';
import { ContactsComponent } from '../pages/contacts/contacts.component';
import { HomeComponent } from '../pages/home/home.component';
import { ProductComponent } from '../pages/product/product.component';
import { ProductsComponent } from '../pages/products/products.component';
import { ErrorNotFoundComponent } from "../pages/error-not-found/error-not-found.component";

const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'cart', component: CartPageComponent }, 
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: ErrorNotFoundComponent },
  { path: 'medicine/restoran', redirectTo: 'products/57218', pathMatch: 'full'},
  { path: 'medicine/office_sta', redirectTo: 'products/55031', pathMatch: 'full'},
  { path: 'medicine/sport', redirectTo: 'products/49442', pathMatch: 'full'},
  { path: 'medicine/yui_1', redirectTo: 'products/52687', pathMatch: 'full'},
  { path: 'medicine/posindroms', redirectTo: 'products/1548', pathMatch: 'full'},   
  { path: 'news', redirectTo: 'clients', pathMatch: 'full'},  
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
