import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1; // default val is 1
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;
  pageNumber: number = 1; // Angular Pagination is 1 based
  pageSize: number = 8; // number of products on page
  totalElements: number = 0;
  previousKeyword: string = '';

  // inject ProductService, and current active route that loaded the component.
  // Usefull for accessing route parameters.
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

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
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;
    // if we have a different keyword than the previous one, then set page number to 1
    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`)

    // now search for the products using keyword
    this.productService.searchProductsPaginate(
      this.pageNumber - 1, // SPRING REST uses 0 based page indexing
      this.pageSize,
      keyword
    ).subscribe(this.processResult());
  }

  // retuns JSON data for keyword pagination
  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1; // Angular Pagination is 1 based
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
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

    // check if the current category id is the same as the previous category id
    // Note: Angular will reuse a component if it is currently being viewed.
    // if a different category is selected, set the page number back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`
    );

    // get the products for the given category id
    this.productService
      .getProductListPaginate(
        this.pageNumber - 1, // SPRING REST uses 0 based page indexing
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  // when user selects page size (how many items displayed on page)
  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize; // convert string to number
    this.pageNumber = 1;
    this.listProducts();
  }
}
