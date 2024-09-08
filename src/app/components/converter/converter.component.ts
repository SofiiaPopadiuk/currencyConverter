import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  currencies: string[];
  rates: { [key: string]: number };
  currencyForm: FormGroup;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      amountFrom: new FormControl(1),
      amountTo: new FormControl(0),
      currencyFrom: new FormControl('UAH'),
      currencyTo: new FormControl('USD'),
    });

    const amountFrom$ = this.setupFormControlStream('amountFrom', 1);
    const amountTo$ = this.setupFormControlStream('amountTo', 0);
    const currencyFrom$ = this.setupFormControlStream('currencyFrom', 'UAH');
    const currencyTo$ = this.setupFormControlStream('currencyTo', 'USD');

    const rates$ = currencyFrom$.pipe(
      switchMap((currencyFrom) => this.currencyService.getRates(currencyFrom)),
    );

    combineLatest([
      amountFrom$.pipe(
        tap(() => this.currencyForm.get('amountTo')?.markAsPristine()),
      ),
      amountTo$.pipe(
        tap(() => this.currencyForm.get('amountFrom')?.markAsPristine()),
      ),
      currencyFrom$,
      currencyTo$,
      rates$,
    ])
      .pipe(filter(([, , , , rates]) => !!rates))
      .subscribe(([amountFrom, amountTo, currencyFrom, currencyTo, rates]) => {
        this.rates = rates;
        this.currencies = Object.keys(rates);
        this.convert(amountFrom, amountTo as number, currencyFrom, currencyTo);
      });
  }

  setupFormControlStream(controlName: string, initialValue: number | string) {
    return this.currencyForm
      .get(controlName)
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        startWith(this.currencyForm.get(controlName).value || initialValue),
      );
  }

  convert(
    amountFrom: number,
    amountTo: number,
    currencyFrom: string,
    currencyTo: string,
  ): void {
    if (this.rates && this.rates[currencyTo] && this.rates[currencyFrom]) {
      const rate = this.rates[currencyTo] / this.rates[currencyFrom];

      if (this.currencyForm.get('amountTo')?.dirty) {
        const calculatedAmountFrom = amountTo / rate;
        this.currencyForm
          .get('amountFrom')
          ?.setValue(calculatedAmountFrom, { emitEvent: false });
      } else {
        const calculatedAmountTo = amountFrom * rate;
        this.currencyForm
          .get('amountTo')
          ?.setValue(calculatedAmountTo, { emitEvent: false });
      }
    }
  }
}
