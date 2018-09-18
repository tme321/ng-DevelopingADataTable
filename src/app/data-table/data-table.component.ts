import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Column } from './column/column.model';

@Component({
  selector: 'table[app-datatable]',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T extends []> implements OnInit {

  @Input() columns: Column[];

  @Input() data: T;

  constructor() { }

  ngOnInit() {
  }

}
