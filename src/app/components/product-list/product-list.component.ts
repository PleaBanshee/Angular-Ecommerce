import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']

})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1; // default val is 1
  currentCategoryName: string = "";
  searchMode: boolean = false;

  // inject ProductService, and current active route that loaded the component.
  // Usefull for accessing route parameters.
  constructor(private productService: ProductService, private route: ActivatedRoute) {

  }

  // A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time,
  // and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
  ngOnInit(): void {
      this.route.paramMap.subscribe(() => {
          this.listProducts(); // invoke method to get products
      });
  }

  listProducts() {

      // perform product search if route contains "keyword"
      this.searchMode = this.route.snapshot.paramMap.has('keyword');

      if (this.searchMode) {
          // do search
          this.handleSearchProducts();
      } else {
          // display products based on category
          this.handleListProducts();
      }

      this.handleListProducts();
  }

  handleSearchProducts() {
      const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

      // now search for the products using keyword
      this.productService.searchProducts(keyword).subscribe(
          data => {
              this.products = data;
          });
  }

  // invokes method once subscribed.
  handleListProducts() {

      // checks if id parameter is present in URL
      // Use activated route, check state of current route, mapp all route parameters and read the id
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      if (hasCategoryId) {
          // get the id param string. Convert string to a number using the "+" symbol. ! is a non-null assertion operator.
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
          // get the "name" param string
          this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      } else {
          // default to category id is 1
          this.currentCategoryId = 1;
          this.currentCategoryName = 'Books';
      }

      // get the products for the given category id
      this.productService.getProductList(this.currentCategoryId).subscribe(
          data => {
              this.products = data; // assign data to product array
          }
      );
  }

}
