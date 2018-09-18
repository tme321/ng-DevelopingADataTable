import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { Data } from './data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  get data$() {
    return this.dataSub.asObservable();
  }

  private dataSub = new BehaviorSubject<Data>([]);

  constructor(private http: HttpClient) {
  }

  getData() {
    this.http.get<Data>('/assets/data.json')
      .subscribe(data=>{this.dataSub.next(data)});
  }

  getData2() {
    this.http.get<Data>('/assets/data2.json')
      .subscribe(data=>{this.dataSub.next(data)});

  }
}
