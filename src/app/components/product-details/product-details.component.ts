import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product; // ensures value is not null

  // pass service and route as constructor parameters
  constructor(private productService: ProductService, private route: ActivatedRoute) {

  }

  // subscribe to service
  ngOnInit(): void {
      this.route.paramMap.subscribe(() => {
        this.handleProductDetails();
      });
  }

  handleProductDetails() {
      // get the "id" param string. Convert string to a number using the "+" symbol
      const productId: number = +this.route.snapshot.paramMap.get('id')!;

      this.productService.getProduct(productId).subscribe(
        data => {
            this.product = data;
        }
      );
    }

}
