import { createReducer, on } from '@ngrx/store';

import * as CurrenciesActions from '../actions/currencies.actions';

export const CurrenciesFeatureKey = 'currencies';

export interface CurrenciesState {
  [currency: string]: { [key: string]: number };
}

export const initialState: CurrenciesState = {};

export const CurrenciesReducer = createReducer(
  initialState,
  on(CurrenciesActions.setCurrencyRates, (state, { currency, rates }) => {
    return { ...state, [currency]: rates };
  }),
);
