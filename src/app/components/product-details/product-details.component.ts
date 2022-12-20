import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product; // ensures value is not null

  // pass product, cart service and route as constructor parameters
  constructor(
    private productService: ProductService,
    private cartServive : CartService,
    private route: ActivatedRoute
  ) {}

  // subscribe to service
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    // get the "id" param string. Convert string to a number using the "+" symbol
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }

  // add to cart from the details view
  addToCart() {
    console.log(`Adding to cart: ${this.product.name}, $${this.product.unitPrice}`);

    const theCartItem = new CartItem(this.product);
    this.cartServive.addToCart(theCartItem);
  }
}
