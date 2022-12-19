// contains modules and configs for the application
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

// routes for viewing products
// NB!!! Order of routes are important. The first match is used.
// Create routes from more to less specific. The generic wildcard route should be last.
const routes: Routes = [
    {
      path: 'products/:id', // can pass id parameter in URL
      component: ProductDetailsComponent // NB!!! very important to check to which component you send the data
    }, {
      path: 'search/:keyword', // can pass keyword parameter in URL
      component: ProductListComponent
    }, {
      path: 'category/:id/:name',
      component: ProductListComponent
    }, {
      path: 'category/:id', // can pass id parameter in URL
      component: ProductListComponent
    }, {
      path: 'category',
      component: ProductListComponent
    }, {
      path: 'products',
      component: ProductListComponent
    }, {
      path: '', // default path
      redirectTo: '/products',
      pathMatch: 'full' // match the full path, instead of just the prefix
    }, {
      path: '**', // generic wildcard. Matchs on anything not in the routes above.
      redirectTo: '/products',
      pathMatch: 'full'
    },
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes), // for routing
    BrowserModule,
    HttpClientModule // for HTTP services
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
