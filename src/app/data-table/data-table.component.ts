import { Component, Input, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { Column, TrackedColumn } from './column/column.model';
import { Subject, Observable } from 'rxjs';
import { scan, share, startWith } from 'rxjs/operators';

export enum SelectionActionTypes {
  InitSelections = 'Init Selections',
  SetSelections = 'Set Selections',
  ToggleSelection = 'Toggle Selection', 
}

export interface SelectionAction {
  payload?: any;
  readonly type: SelectionActionTypes;
}

export class InitSelections implements SelectionAction {
  readonly type = SelectionActionTypes.InitSelections;
}

export class SetSelections implements SelectionAction {
  readonly type = SelectionActionTypes.SetSelections;
  constructor(public payload: { selections: Array<boolean>}) {}
}

export class ToggleSelection implements SelectionAction {
  readonly type = SelectionActionTypes.ToggleSelection;
  constructor(public payload: { index: number }) {}
}

export type SelectionActions = InitSelections | SetSelections | ToggleSelection;

@Component({
  selector: 'table[app-datatable]',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T> {
  private trackedColumns: TrackedColumn[];
  private columnsId = 0;
  private dataCache: T[] = [];

  selectionAction = new Subject<SelectionAction>();
  selections$: Observable<Array<boolean>>;

  @Input() set data(data: T[]) {
    this.dataCache = data;
    
    this.selectionAction.next(
      new SetSelections({
        selections: (new Array(data.length)).fill(false)
      }));
  }

  get data() {
    return this.dataCache;
  }

  @Input() set columns(columns: Column[]) {
    this.trackedColumns = columns.map(c=>({
      ...c,
      id: this.columnsId++
    }));
  }

  get columns() {
    return this.trackedColumns;
  }

  @Input() rowTracker: TrackByFunction<T> = (index: number, row: T)=>row;

  columnTracker: TrackByFunction<TrackedColumn> = 
    (index: number, column: TrackedColumn) => column.id;

  constructor() {
    this.selections$ = this.selectionAction.pipe(
      startWith(new InitSelections()),
      scan(
        this.selectionsReducer, []));
  }

  selectionsReducer(selections:Array<boolean>, action: SelectionActions) {
    switch(action.type) {
      case SelectionActionTypes.InitSelections: {
        return [];
        break;
      }
      case SelectionActionTypes.SetSelections: { 
        return action.payload.selections;
        break;
      }
      case SelectionActionTypes.ToggleSelection: {
        const index = action.payload.index;
        const newSelections = [...selections]; 
        newSelections[index] = !newSelections[index];
        return newSelections;
        break;
      }
      default: {
        return selections;
      }
    }
  }

  rowClicked(index: number) {
    this.selectionAction.next(new ToggleSelection({ index: index }));
  }

  getData(path: string, row: T) {
    return path
      .split('.')
      .reduce((data,fragment)=>data[fragment] || '', row);
  }

}


abstract class UnusedMethods<T> {

  /* Timing Row Data Changes */
  private dataCache: T[];

  private startTime;

  @Input() set data(d: T[]){
    console.log('new data');
    this.startTime = performance.now(); 
    this.dataCache = d;
  }

  get data() {
    return this.dataCache;
  }

  ngAfterViewChecked() {
    if(this.startTime) {
      console.log('ellapsed time:', (performance.now() - this.startTime)/1000);
    }
    this.startTime = null;
  }

  /* Timing Row Data Changes */


  /* Columns Caching */

  private c: Column[]
  private columnsCache;
  
  @Input() set columns(columns: Column[]) {
    if(this.c != columns) {
      console.log('cols');
      this.columnsCache = columns.map(c=>({
          title: c.title,
          path: c.path.split('.')
      }));
      this.c = columns;
    }
  }

  get columns() {
    return this.columnsCache;
  }
  
  getDataCachedCols(path: string[], row: T) {
    return path.reduce((data,fragment)=>data[fragment] || '', row);
  }

  /* Columns Caching */

  getDataIf(path: string, row: T) {  
    return path.split('.').reduce((data,fragment)=>{
      if(data[fragment]) {
        return data[fragment];
      }
      else {
        return '';
      }
    },row);    
  }

  getDataFor(path: string, row: T) {
    let data: T | T[keyof T] | string  = row;

    for(let fragment of path.split('.')) {
      if(data[fragment]) {
        data = data[fragment];
      }
      else {
        data = '';
        break;
      }
    }
    return data;
  }

  getDataForOf(path: string, row: T) {
    let data: T | T[keyof T] | string  = row;

    const paths = path.split('.');
    for(let i = 0; i < paths.length; i++) {
      if(data[paths[i]]) {
        data = data[paths[i]];
      }
      else {
        data = '';
        break;
      }
    }

    return data;
  }

  columnTracker(index: number, column: Column) {
    return column.title;
  }

  rowTracker(index: number, row: T) {
    return row['_id'];
  }

}
