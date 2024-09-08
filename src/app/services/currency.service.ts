import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { BaseCurrencyRate } from '../models/currency.model';
import { setCurrencyRates } from '../store/actions/currencies.actions';
import { selectCurrencyRate } from '../store/selectors/currencies.selectors';

const API_KEY = '3291bb259083ca4f298b6ac3';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private loadedCurrencies: string[] = [];

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  getRates(
    baseCurrency: string,
  ): Observable<{ [currencyCode: string]: number }> {
    if (this.loadedCurrencies.includes(baseCurrency)) {
      return this.store.select(selectCurrencyRate(baseCurrency));
    }
    this.loadedCurrencies.push(baseCurrency);
    return this.loadRates(baseCurrency);
  }

  private loadRates(
    baseCurrency: string,
  ): Observable<{ [currencyCode: string]: number }> {
    return this.http
      .get<BaseCurrencyRate>(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`,
      )
      .pipe(
        tap((rates) => {
          this.store.dispatch(
            setCurrencyRates({
              currency: baseCurrency,
              rates: rates.conversion_rates,
            }),
          );
        }),
        map((rates) => rates.conversion_rates),
      );
  }
}
