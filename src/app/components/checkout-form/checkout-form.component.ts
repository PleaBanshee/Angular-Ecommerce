import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css'],
})
export class CheckoutFormComponent implements OnInit {
  checkoutFormGroup!: FormGroup; //  non-null assertion on form instantiation
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  currentMonth: number = new Date().getMonth() + 1; // months are zero-based in TypeScript
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // inject FormBuilder and CheckoutService
  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService
  ) {}

  // build the form
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months
    let startMonth: number = new Date().getMonth() + 1; // months are zero-based in TypeScript
    this.checkoutService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('Retrieved credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });
    // populate credit card years
    this.checkoutService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });

    // populate countries
    this.checkoutService.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  onSubmit() {
    console.log('Handling the form checkout');
    // log form values. Check for null or undefined values
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(
      `The email address is ${
        this.checkoutFormGroup.get('customer')?.value.email
      }`
    );
    console.log(`Shipping Address country code: ${this.checkoutFormGroup.get('shippingAddress')?.value.country.code}`);
    console.log(`Shipping Address country name: ${this.checkoutFormGroup.get('shippingAddress')?.value.country.name}`);
    console.log(`Shipping Address state name: ${this.checkoutFormGroup.get('shippingAddress')?.value.state.name}`);
    console.log(`Billing Address country code: ${this.checkoutFormGroup.get('billingAddress')?.value.country.code}`);
    console.log(`Billing Address country name: ${this.checkoutFormGroup.get('billingAddress')?.value.country.name}`);
    console.log(`Billing Address state name: ${this.checkoutFormGroup.get('billingAddress')?.value.state.name}`);
  }

  // copy shipping address to billing address
  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  // modify the credit card months based on the year selected
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );
    // if the current year equals the selected year, then start with the current month
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = this.currentMonth;
    } else {
      startMonth = 1;
    }
    // get the credi card months from service
    this.checkoutService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('Retrieved credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });
  }

  // get states for the selected country
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code; // safe navigation operator, ?, guards against null and undefined values
    const countryName = formGroup?.value.country.name;
    this.checkoutService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      // select the first item by default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
