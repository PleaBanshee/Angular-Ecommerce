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
      return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
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
