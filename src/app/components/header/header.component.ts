import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { HeaderConfig } from '../../configs/header.config';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  protected readonly baseCurrency = 'UAH';

  rates$: Observable<[string, number][]>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.rates$ = this.currencyService
      .getRates(this.baseCurrency)
      .pipe(
        map((rates) =>
          Object.entries(rates).filter(([currencyCode]) =>
            HeaderConfig.includes(currencyCode),
          ),
        ),
      );
  }
}
