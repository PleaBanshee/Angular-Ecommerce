import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {}

  // returns an observable. Maps the JSON data from Spring REST to Products
  getProductList(categoryId: number): Observable<Product[]> {
    // need to build URL based on category id. Check Spring REST endpoint
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    // Call REST API, returns an observable, map the JSON data from Spring REST to ProductCategory array
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProducts(keyword: string): Observable<Product[]> {
    // need to build URL based on keyword. Check Spring REST endpoint
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map((response) => response._embedded.products) // returns JSON data
    );
  }

  getProduct(productId: number): Observable<Product> {
    // need to build URL based on product id. Check Spring REST endpoint
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl); // call REST API
  }

  // Pagination method
  getProductListPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponseProducts> {
    // need to build URL based on category id,page number and page size. Check Spring REST endpoint
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl); // return data
  }
}

// Unwraps JSON from Spring REST _embedded entry. Check REST API json.
// interface for product list
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    // pagination info
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

// interface for product category
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
