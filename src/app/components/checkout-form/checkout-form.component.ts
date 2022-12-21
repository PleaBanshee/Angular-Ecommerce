import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.checkoutFormGroup = new FormGroup({});
  }

  // build the form
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      })
      // shippingAddress: this.formBuilder.group({
      //   street: [''],
      //   city: [''],
      //   state: [''],
      //   country: [''],
      //   zipCode: [''],
      // }),
      // billingAddress: this.formBuilder.group({
      //   street: [''],
      //   city: [''],
      //   state: [''],
      //   country: [''],
      //   zipCode: [''],
      // }),
      // creditCard: this.formBuilder.group({
      //   cardType: [''],
      //   nameOnCard: [''],
      //   cardNumber: [''],
      //   securityCode: [''],
      //   expirationMonth: [''],
      //   expirationYear: [''],
      // }),
    });
  }

}
