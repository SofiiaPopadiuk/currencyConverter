import { createAction, props } from '@ngrx/store';

export const getCurrencyRates = createAction(
  '[Currencies] get currency rates',
  props<{ currency: string }>(),
);

export const setCurrencyRates = createAction(
  '[Currencies] set currency rates',
  props<{ currency: string; rates: { [key: string]: number } }>(),
);
