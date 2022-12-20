import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  // Subject is a subclass of Observable. Used to publih events in code.
  // Event will be sent to all subscribers
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  // add items to cart
  addToCart(cartItem: CartItem) {
    // check for item in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;
    if (this.cartItems.length > 0) {
      // find item in cart
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === cartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
    }
    // check if item exists in cart
    alreadyExistsInCart = existingCartItem != undefined;

    // if item exists in cart, increment quantity, else add to cart
    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    // compute the cart's total price and total quantity
    this.computeCartTotals();
  }

  // method to calculate cart's total price and total quantity
  computeCartTotals() {
    throw new Error('Method not implemented.');
  }
}
