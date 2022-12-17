import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = "http://localhost:8080/api/products";

  constructor(private httpClient: HttpClient) {

  }

  // returns an observable. Maps the JSON data from Spring REST to Products
  getProductList(categoryId: number): Observable<Product[]> {

      // need to build URL based on category id. Check Spring REST endpoint
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

      return this.httpClient.get<GetResponse>(searchUrl).pipe(
          map(response => response._embedded.products)
      );
  }
}

// Unwraps JSON from Spring REST _embedded entry. Check REST API json.
interface GetResponse {
    _embedded: {
        products: Product[];
    }
}
