import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  // styleUrls: ['./product-list.component.css']
  styleUrls: ['./product-list.component.css']

})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  constructor(private productService: ProductService) { }

  // A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time,
  // and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
  ngOnInit(): void {
      this.listProducts();
  }

  // invokes method once subscribed
  listProducts() {
      this.productService.getProductList().subscribe(
          data => {
              this.products = data; // assign data to product array
          }
      );
  }

}
