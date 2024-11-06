import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {State} from '../../../../core/model/state.model';
import {Country} from './country.model';
import {catchError, map, Observable, of, retry, shareReplay, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  http: HttpClient = inject(HttpClient);

  private  countries$:WritableSignal<State<Array<Country>>> = signal(State.Builder<Array<Country>>().forInit());
  private fetchCountry$ = new Observable<Array<Country>>();
  countries = computed(() => this.countries$());
  constructor() { }

  initFetchGetAllCountries():void{
    this.fetchCountry$=this.http.get<Array<Country>>("/assets/countries.json").pipe(
      tap(countries=>this.countries$.set(State.Builder<Array<Country>>().forSuccess(countries))),
      catchError(err=> {
        this.countries$.set(State.Builder<Array<Country>>().forError(err));
        return of(err);
      }),

      shareReplay(1)
    );
  }

  public getCountryByCode(code: string): Observable<Country> {
    return this.fetchCountry$.pipe(
      map(countries => countries.filter(country => country.cca3 === code)),
      map(countries => countries[0]) //we want firs occurrence of these countries.
    );
  };

}
