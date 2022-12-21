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
      // find item in cart, check that the cart is not empty
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === cartItem.id
      )!;
      // check if item exists in cart
      alreadyExistsInCart = existingCartItem != undefined;
    }

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
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values, all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue); // next() publishes/sends an event
    this.totalQuantity.next(totalQuantityValue);
    // log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  // logging for debugging purposes
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity=${tempCartItem.quantity},
        unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )}, totalQuantity: ${totalQuantityValue}`
    );
    console.log('----');
  }

  // decrement quantity of product from cart checkout --- service
  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  // remove item from cart
  remove(cartItem: CartItem) {
    // get index of item in cart
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === cartItem.id
    );
    // if found, remove item from cart
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1); // removes element from array and returns it
      this.computeCartTotals();
    }
  }
}
