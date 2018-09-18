import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Column } from './column/column.model';

@Component({
  selector: 'table[app-datatable]',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T> {

  @Input() columns: Column[];
  @Input() data: T[];

  constructor() { }

  getData(path: string, row: T) {
    return path.split('.').reduce((data,fragment)=>{
      if(data[fragment]) {
        return data[fragment];
      }
      else {
        return '';
      }
    },row);
  }
}
