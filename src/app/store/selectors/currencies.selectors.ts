import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CurrenciesFeatureKey,
  CurrenciesState,
} from '../reducers/currencies.reducer';

export const selectCurrenciesFeature =
  createFeatureSelector<CurrenciesState>(CurrenciesFeatureKey);

export const selectCurrencyRate = (currency: string) =>
  createSelector(
    selectCurrenciesFeature,
    (state: CurrenciesState) => state[currency],
  );
