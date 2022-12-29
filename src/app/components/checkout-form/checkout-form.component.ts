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
        // FormControl(value, validators)
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl('', [
          Validators.required,
          // regex expression for email validation
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        expirationMonth: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        expirationYear: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
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
    console.log(
      `Shipping Address country code: ${
        this.checkoutFormGroup.get('shippingAddress')?.value.country.code
      }`
    );
    console.log(
      `Shipping Address country name: ${
        this.checkoutFormGroup.get('shippingAddress')?.value.country.name
      }`
    );
    console.log(
      `Shipping Address state name: ${
        this.checkoutFormGroup.get('shippingAddress')?.value.state.name
      }`
    );
    console.log(
      `Billing Address country code: ${
        this.checkoutFormGroup.get('billingAddress')?.value.country.code
      }`
    );
    console.log(
      `Billing Address country name: ${
        this.checkoutFormGroup.get('billingAddress')?.value.country.name
      }`
    );
    console.log(
      `Billing Address state name: ${
        this.checkoutFormGroup.get('billingAddress')?.value.state.name
      }`
    );
  }

  // copy shipping address to billing address
  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      // update shipping and billing states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      // reset billing states
      this.billingAddressStates = [];
    }
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer')?.value.firstName;
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer')?.value.lastName;
  }

  get email() {
    return this.checkoutFormGroup.get('customer')?.value.email;
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
