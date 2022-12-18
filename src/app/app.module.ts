// contains modules and configs for the application
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './compnents/product-category-menu/product-category-menu.component';

// routes for viewing products
// NB!!! Order of routes are important. The first match is used.
// Create routes from more to less specific. The generic wildcard route should be last.
const routes: Routes = [
    {
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
    ProductCategoryMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // for HTTP services
    RouterModule.forRoot(routes) // for routing
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
