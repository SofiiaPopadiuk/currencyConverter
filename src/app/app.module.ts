import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConverterComponent } from './components/converter/converter.component';
import { HeaderComponent } from './components/header/header.component';
import {
  CurrenciesFeatureKey,
  CurrenciesReducer,
} from './store/reducers/currencies.reducer';

@NgModule({
  declarations: [AppComponent, ConverterComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ [CurrenciesFeatureKey]: CurrenciesReducer }),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
